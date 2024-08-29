import { createClient, ErrorResponse, PhotosWithTotalResults } from "pexels";
import { OpenAiDateIdea } from "./openai.service";

const client = createClient(process.env.PEXEL_KEY || "");

async function getPexelsPhoto(query: string) {
  const photos = await client.photos.search({ query, per_page: 1 });

  if ((photos as ErrorResponse).error) {
    throw new Error((photos as ErrorResponse).error);
  }

  return (photos as PhotosWithTotalResults)?.photos?.[0]?.src?.medium;
}

export async function getPhotosForDates(
  dates: OpenAiDateIdea[]
): Promise<OpenAiDateIdea[]> {
  const photos = await Promise.all(
    dates.map((date) => getPexelsPhoto(date.title))
  );

  dates.forEach((date, index) => {
    date.photoUrl = photos[index];
  });

  return dates;
}
