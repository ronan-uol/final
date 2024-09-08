import { prisma } from "services/db/db.server";
import { getAiQuiz } from "./openai.service";

type submitQuizAnswerArgs = {
  quizId: string;
  userId: string;
  questionId: string;
  answer: string;
};

export async function submitQuizAnswer({
  quizId,
  userId,
  questionId,
  answer,
}: submitQuizAnswerArgs) {
  try {
    let completedQuiz = await prisma.completedQuiz.findFirst({
      where: {
        userId,
        quizId,
      },
    });

    if (!completedQuiz) {
      completedQuiz = await prisma.completedQuiz.create({
        data: {
          userId,
          quizId,
          answers: JSON.stringify({}),
        },
      });
    }

    const answers = JSON.parse(completedQuiz.answers);
    answers[questionId] = answer;

    const updatedQuiz = await prisma.completedQuiz.update({
      where: {
        id: completedQuiz.id,
      },
      data: {
        answers: JSON.stringify(answers),
      },
    });

    return { updatedQuiz };
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    throw new Error("Unable to submit answer");
  }
}

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

export async function getPartnerQuizAnswers(userId: string, quizId: string) {
  const quizzes = await prisma.completedQuiz.findMany({
    where: {
      userId,
    },
    include: {
      quiz: true,
    },
  });

  console.log({ quizzes });

  const quiz = quizzes.find((quiz) => quiz.quizId === quizId);

  if (!quiz) {
    return null;
  }

  return JSON.parse(quiz.answers) as { [key: string]: string };
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
