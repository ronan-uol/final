import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";

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

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-blue-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Daily Quizzes
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-600">
            Get to know your partner better with our daily AI-generated quizzes.
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Today's Theme: Dragons and Dungeons
            </h2>

            {quizzes.map((quiz, quizIndex) => (
              <div key={quiz.id} className="mb-8">
                <ol className="space-y-4 list-decimal pl-5 text-gray-700">
                  {quiz.questions.map((question, questionIndex) => (
                    <li
                      key={question.id}
                      className="rounded-lg shadow-lg p-6 bg-blue-50 border-l-4 border-blue-200"
                    >
                      <p className="text-lg font-semibold text-blue-800">
                        {question.question}
                      </p>

                      <div className="mt-4 flex items-center space-x-4">
                        <textarea
                          value={answers[quizIndex][questionIndex]}
                          onChange={(e) =>
                            handleAnswerChange(
                              quizIndex,
                              questionIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border border-blue-300 rounded-md text-gray-800"
                          placeholder="Write your answer here..."
                        />
                        <button
                          onClick={() => handleReveal(quizIndex, questionIndex)}
                          className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
                        >
                          Reveal
                        </button>
                      </div>

                      {revealed[quizIndex][questionIndex] && (
                        <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-300 rounded-md">
                          <p className="text-lg font-bold text-blue-800">
                            Partner's Answer:
                          </p>
                          <p className="mt-2 text-blue-600">
                            {question.partnerAnswer
                              ? question.partnerAnswer
                              : "Your partner hasn't answered this question yet."}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
