import { prisma } from "services/db/db.server";
import { getPhotosForDates } from "./pexels.service";
import { getAiDateIdeas } from "./openai.service";

export async function getDateIdeas() {
  const dateIdeas = await prisma.dateIdea.findMany();

  if (!dateIdeas || dateIdeas.length === 0) {
    return [];
  }

  return dateIdeas;
}

export async function refreshDateIdeas() {
  const ideas = await getAiDateIdeas();
  const dateIdeasWithPhotos = await getPhotosForDates(ideas);
  const dateIdeasData = dateIdeasWithPhotos.map((idea) => ({
    title: idea.title,
    description: idea.description,
    url: idea.photoUrl || "",
  }));

  await prisma.$transaction(async (tx) => {
    // Delete all existing date ideas
    await tx.dateIdea.deleteMany();

    // Create new date ideas in a batched write
    await tx.dateIdea.createMany({
      data: dateIdeasData,
    });
  });
}
