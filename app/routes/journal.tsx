import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  // Mocked data for now, you should replace this with real data fetching logic
  const journalEntries = [
    {
      id: 1,
      author: user.name,
      timestamp: new Date().toLocaleString(),
      content: "This is my first journal entry.",
    },
    {
      id: 2,
      author: "Jamie Doe",
      timestamp: new Date().toLocaleString(),
      content: "This is Jamie's journal entry.",
    },
  ];

  return json({ user, journalEntries });
}

export default function Journal() {
  const { user, journalEntries } = useLoaderData() as {
    user: { name: string; id: "id"; email: "email" };
    journalEntries: {
      id: number;
      author: string;
      timestamp: string;
      content: string;
    }[];
  };

  const [newEntry, setNewEntry] = useState("");

  const handleAddEntry = () => {
    setNewEntry("");
  };

  const getEntryStyle = (author: string) => {
    if (author === user.name) {
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
                style={getEntryStyle(entry.author)}
              >
                <p className="text-gray-600">{entry.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>{entry.author}</span> | <span>{entry.timestamp}</span>
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
