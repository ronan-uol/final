import { prisma } from "services/db/db.server";

export async function getPartnerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user?.partnershipId) {
    return null;
  }

  return user.partnershipId;
}

export async function getUserMetrics(
  userId: string,
  lastSignIn: Date,
  createdOn: Date
) {
  const totalJournals = await prisma.journalEntry.count({
    where: {
      authorId: userId,
    },
  });

  const msInADay = 24 * 60 * 60 * 1000;
  const daysSignedIn = Math.ceil(
    (new Date(lastSignIn).getTime() - new Date(createdOn).getTime()) / msInADay
  );

  const numberOfDateIdeasPerDay = 6;

  const userMetrics = {
    totalJournals: totalJournals,
    dateIdeasExplored: daysSignedIn * numberOfDateIdeasPerDay,
    daysSignedIn,
  };

  return userMetrics;
}

export async function addPartnershipIdByEmail(email: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  const partnershipId = user.id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      partnershipId,
    },
  });
}
