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
