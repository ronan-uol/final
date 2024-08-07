import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";
import { getJournalEntries } from "~/services/journal.service";
import { JournalEntry, User } from "@prisma/client";
import { parseJsonAndReviveDate } from "~/utils";

export async function action({ request }: LoaderFunctionArgs) {}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const journalEntries = await getJournalEntries(user.id);

  return json({ user, journalEntries });
}

export default function Journal() {
  const data = useLoaderData();
  const { user, journalEntries } = parseJsonAndReviveDate(data) as {
    user: { name: string; id: string; email: string };
    journalEntries: (JournalEntry & { author: User })[];
  };

  const [newEntry, setNewEntry] = useState("");

  const handleAddEntry = () => {
    setNewEntry("");
  };

  const getEntryStyle = (id: string) => {
    if (id === user.id) {
      return {
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      }; // Blue color for signed-in user
    } else {
      return {
        backgroundColor: "rgba(34, 197, 94, 0.2)",
      }; // Green color for other users
    }
  };

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-blue-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Shared Journal
          </h1>
          <p className="text-lg md:text-xl mt-2">
            Share your thoughts and experiences with your partner.
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Journal Entries
          </h2>

          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-lg shadow-md"
                style={getEntryStyle(entry.authorId)}
              >
                <p className="text-gray-600">{entry.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>{entry.author.name}</span> |{" "}
                  <span>{entry.timestamp.toString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-lg shadow-md"
              placeholder="Write your journal entry here..."
            />
            <button
              onClick={handleAddEntry}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
            >
              Add Entry
            </button>
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
