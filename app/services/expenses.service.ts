import { prisma } from "services/db/db.server";
import { getPartnerId } from "./user.service";

export async function getExpenses(userId: string) {
  const partnerId = await getPartnerId(userId);

  const promises = [userId, partnerId].map((id) =>
    prisma.expense.findMany({
      where: {
        authorId: id || "",
      },
      include: {
        author: true,
      },
    })
  );

  const [userExpenses, partnerExpenses] = await Promise.all(promises);

  return [...userExpenses, ...partnerExpenses].map((expense) => ({
    ...expense,
    author: expense.author.name,
  }));
}

export async function addExpense(
  userId: string,
  amount: number,
  description: string
) {
  return prisma.expense.create({
    data: {
      amount,
      description,
      authorId: userId,
    },
  });
}
