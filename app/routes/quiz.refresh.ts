import { json } from "@remix-run/node";
import { getDailyQuiz, refreshDailyQuiz } from "~/services/quizzes.service";

export async function action() {
  const dailyQuiz = await getDailyQuiz();

  if (dailyQuiz) {
    return json({ quiz: dailyQuiz });
  }

  const updatedQuiz = await refreshDailyQuiz();

  if (!updatedQuiz) {
    return json({ error: "Daily quiz not found" }, { status: 404 });
  }

  return json({ quiz: updatedQuiz });
}
