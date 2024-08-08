import { prisma } from "services/db/db.server";
import { getPartnerId } from "./user.service";

export async function getJournalEntries(userId: string) {
  const partnerId = await getPartnerId(userId);

  const promises = [userId, partnerId].map((id) =>
    prisma.journalEntry.findMany({
      where: {
        authorId: id || "",
      },
      orderBy: {
        timestamp: "desc",
      },
      include: {
        author: true,
      },
    })
  );

  const [userEntries, partnerEntries] = await Promise.all(promises);

  return [...userEntries, ...partnerEntries];
}

export async function addJournalEntry(userId: string, content: string) {
  return prisma.journalEntry.create({
    data: {
      content,
      authorId: userId,
    },
  });
}

export async function deleteJournalEntry(entryId: string) {
  return prisma.journalEntry.delete({
    where: {
      id: entryId,
    },
  });
}
