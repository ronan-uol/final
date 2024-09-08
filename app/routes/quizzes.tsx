import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";
import { getDailyQuiz } from "~/services/quizzes.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const quiz = await getDailyQuiz();

  if (!quiz) {
    return json({ error: "No quizzes found" }, { status: 404 });
  }

  return json({ user, quiz });
}

export default function Quizzes() {
  const { user, quiz } = useLoaderData();
  const [answers, setAnswers] = useState(quiz.questions.map(() => ""));
  const [revealed, setRevealed] = useState(quiz.questions.map(() => false));

  const handleAnswerChange = (questionIndex, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleReveal = (questionIndex) => {
    const updatedRevealed = [...revealed];
    updatedRevealed[questionIndex] = true;
    setRevealed(updatedRevealed);
  };

  const handleSubmit = async (questionIndex) => {
    // Handle your form submission logic here
    console.log("Submitted answer:", answers[questionIndex]);
  };

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Daily Quizzes
          </h1>
        </header>

        <main className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div key={quiz.id} className="mb-8">
              <div className="space-y-8">
                {quiz.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="rounded-lg shadow-lg p-6 bg-white border-l-4 "
                  >
                    <p className="text-lg font-semibold text-blue-800">
                      {question.questionText}
                    </p>

                    <div className="mt-4">
                      <textarea
                        value={answers[questionIndex]}
                        onChange={(e) =>
                          handleAnswerChange(questionIndex, e.target.value)
                        }
                        className="w-full p-2 border border-blue-300 rounded-md text-gray-800 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your answer here..."
                      />
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={() => handleSubmit(questionIndex)}
                          className="bg-green-200 text-gray-800 py-2 px-4 rounded-full font-semibold shadow hover:bg-green-300 transition duration-300"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => handleReveal(questionIndex)}
                          className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
                        >
                          Reveal
                        </button>
                      </div>
                    </div>

                    {revealed[questionIndex] && (
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
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
