import { json } from "@remix-run/node";
import { getDateIdeas, refreshDateIdeas } from "~/services/dates.service";

export async function action() {
  await refreshDateIdeas();

  const dateIdeas = await getDateIdeas();

  console.log({ dateIdeas });

  return json({ dateIdeas });
}
