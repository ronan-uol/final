import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { UserWithId } from "interfaces/user";
import { authenticator } from "services/auth/authService.server";
import { Card } from "~/components/card";
import { Header } from "~/components/header";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const userMetrics = {
    consecutiveDaysSignedIn: 12,
    totalJournals: 34,
    dateIdeasExplored: 10,
  };

  return json({ user, userMetrics });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: ROUTES.LOGIN });
}

export default function Dashboard() {
  const { user, userMetrics } = useLoaderData<{
    user: UserWithId;
    userMetrics: any;
  }>();

  return (
    <>
      <Header user={user} />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <header className="mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Welcome, {user.name}
          </h1>
        </header>

        <section className="mb-8">
          <p className="text-gray-800 mt-4 text-lg md:text-xl">
            Make the most out of your time together with Anchor. Explore the
            features below to enhance your relationship.
          </p>
        </section>

        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <Card
            title="Shared Journal"
            description="Write and share your thoughts and experiences."
            link="/journal"
            icon="📝"
          />
          <Card
            title="Date Night Ideas"
            description="Find fun and exciting date night ideas."
            link="/date-ideas"
            icon="🎉"
          />
          <Card
            title="Expense Tracker"
            description="Manage and track your expenses together."
            link="/expenses"
            icon="💸"
          />
          <Card
            title="Quizzes"
            description="Take quizzes to get to know each other better."
            link="/quizzes"
            icon="🧩"
          />
        </main>

        <section className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Your Relationship Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 text-center">
            <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-900 p-4 rounded-lg shadow">
              <h3 className="text-xl md:text-2xl font-semibold">
                {userMetrics.consecutiveDaysSignedIn}
              </h3>
              <p className="mt-2">Days in a Row Signed In</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-100 text-green-900 p-4 rounded-lg shadow">
              <h3 className="text-xl md:text-2xl font-semibold">
                {userMetrics.totalJournals}
              </h3>
              <p className="mt-2">Total Journals Written</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-purple-100 text-purple-900 p-4 rounded-lg shadow">
              <h3 className="text-xl md:text-2xl font-semibold">
                {userMetrics.dateIdeasExplored}
              </h3>
              <p className="mt-2">Date Ideas Explored</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
