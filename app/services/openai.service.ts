import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export type OpenAiDateIdea = {
  title: string;
  description: string;
  photoUrl?: string;
};

export async function getAiDateIdeas() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'You are an assistant whose job is to create date ideas. Respond with 6 romantic and creative date ideas in the following JSON format: {"dates": [{title: "Picnic in the Park", description: "Pack some snacks and enjoy a sunny day in the park."}]}',
        },
      ],
      model: "gpt-4o-mini",
      response_format: {
        type: "json_object",
      },
    });

    const unparsedIdeas = completion?.choices?.[0]?.message?.content;

    if (!unparsedIdeas) {
      throw new Error("Failed to fetch data from OpenAI");
    }

    const ideas = JSON.parse(unparsedIdeas);

    return ideas.dates.map(
      ({ title, description }: OpenAiDateIdea, index: number) => ({
        id: index + 1,
        title,
        description,
      })
    );
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error);
    throw new Error("Failed to fetch data from OpenAI");
  }
}
