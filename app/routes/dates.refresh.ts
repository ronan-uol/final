import { json } from "@remix-run/node";
import { getDateIdeas, refreshDateIdeas } from "~/services/dates.service";

export async function action() {
  await refreshDateIdeas();

  const dateIdeas = await getDateIdeas();

  if (!dateIdeas || !dateIdeas.length) {
    return json({ error: "No date ideas found" }, { status: 404 });
  }

  return json({ dateIdeas });
}
