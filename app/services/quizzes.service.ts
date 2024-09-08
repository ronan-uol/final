import { prisma } from "services/db/db.server";
import { getAiQuiz } from "./openai.service";

export async function getDailyQuiz() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const quiz = await prisma.quiz.findFirst({
    where: {
      date: {
        gte: startOfDay.toISOString(),
        lt: endOfDay.toISOString(),
      },
    },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    return null;
  }

  return quiz;
}
export async function refreshDailyQuiz() {
  const questions = await getAiQuiz();

  const quiz = await prisma.quiz.create({
    data: {
      date: new Date().toISOString(),
      questions: {
        create: questions.map(({ question }) => ({
          questionText: question,
        })),
      },
    },
    include: {
      questions: true,
    },
  });

  return quiz;
}
