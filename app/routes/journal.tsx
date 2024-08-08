import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";
import {
  addJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
} from "~/services/journal.service";
import { JournalEntry, User } from "@prisma/client";
import { parseJsonAndReviveDate } from "~/utils";
import { useEffect, useRef } from "react";

export async function action({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const formData = await request.formData();

  const { _action, ...data } = Object.fromEntries(formData);

  if (_action === "delete" && data?.entryId) {
    return await deleteJournalEntry(data?.entryId as string);
  }

  if (_action === "add" && data?.content) {
    return await addJournalEntry(user.id, data?.content as string);
  }
}

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
  const navigation = useNavigation();
  let submitting = navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!submitting) {
      formRef.current?.reset();
    }
  }, [submitting]);

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
                className="relative p-4 rounded-lg shadow-md"
                style={getEntryStyle(entry.authorId)}
              >
                {entry.authorId === user.id && (
                  <Form method="post" className="absolute top-2 right-2">
                    <input type="hidden" name="entryId" value={entry.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✖
                    </button>
                  </Form>
                )}
                <p className="text-gray-600">{entry.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>{entry.author.name}</span> |{" "}
                  <span>{new Date(entry.timestamp).toString()}</span>
                </div>
              </div>
            ))}
          </div>

          <Form ref={formRef} method="post" className="mt-8">
            <textarea
              rows={4}
              name="content"
              className="w-full p-4 rounded-lg shadow-md"
              placeholder="Write your journal entry here..."
            />
            <button
              type="submit"
              name="_action"
              value="add"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
            >
              Add Entry
            </button>
          </Form>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
