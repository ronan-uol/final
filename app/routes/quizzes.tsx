import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const quizzes = [
    {
      id: 1,
      date: new Date().toLocaleDateString(),
      questions: [
        {
          id: 1,
          question: "What is your partner's favorite movie?",
          answer: null,
          partnerAnswer: "Inception",
        },
        {
          id: 2,
          question: "What is your partner's dream vacation destination?",
          answer: null,
          partnerAnswer: "Italy",
        },
        {
          id: 3,
          question: "What is your partner's biggest fear?",
          answer: null,
          partnerAnswer: null,
        },
      ],
    },
    // Add more quiz data here as needed
  ];

  return json({ user, quizzes });
}

export default function Quizzes() {
  const { user, quizzes } = useLoaderData();
  const [answers, setAnswers] = useState(
    quizzes.map((quiz) => quiz.questions.map(() => ""))
  );
  const [revealed, setRevealed] = useState(
    quizzes.map((quiz) => quiz.questions.map(() => false))
  );

  const handleAnswerChange = (quizIndex, questionIndex, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[quizIndex][questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleReveal = (quizIndex, questionIndex) => {
    const updatedRevealed = [...revealed];
    updatedRevealed[quizIndex][questionIndex] = true;
    setRevealed(updatedRevealed);
  };

  const handleSubmit = async (quizIndex, questionIndex) => {
    // Handle your form submission logic here
    console.log("Submitted answer:", answers[quizIndex][questionIndex]);
  };

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Daily Quizzes
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-600">
            Today's theme: Dungeons and Dragons
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            {quizzes.map((quiz, quizIndex) => (
              <div key={quiz.id} className="mb-8">
                <div className="space-y-8">
                  {quiz.questions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      className="rounded-lg shadow-lg p-6 bg-white border-l-4 "
                    >
                      <p className="text-lg font-semibold text-blue-800">
                        {question.question}
                      </p>

                      <div className="mt-4">
                        <textarea
                          value={answers[quizIndex][questionIndex]}
                          onChange={(e) =>
                            handleAnswerChange(
                              quizIndex,
                              questionIndex,
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-blue-300 rounded-md text-gray-800 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write your answer here..."
                        />
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() =>
                              handleSubmit(quizIndex, questionIndex)
                            }
                            className="bg-green-200 text-gray-800 py-2 px-4 rounded-full font-semibold shadow hover:bg-green-300 transition duration-300"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              handleReveal(quizIndex, questionIndex)
                            }
                            className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
                          >
                            Reveal
                          </button>
                        </div>
                      </div>

                      {revealed[quizIndex][questionIndex] && (
                        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                          <p className="text-lg font-bold text-green-800">
                            Partner's Answer:
                          </p>
                          <p className="mt-2 text-green-800">
                            {question.partnerAnswer
                              ? question.partnerAnswer
                              : "Your partner hasn't answered this question yet."}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
