import { prisma } from "services/db/db.server";
import { getPartnerId } from "./user.service";

export async function getJournalEntries(userId: string) {
  const partnerId = await getPartnerId(userId);

  const promises = [userId, partnerId].map((id) =>
    prisma.journalEntry.findMany({
      where: {
        authorId: userId,
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
