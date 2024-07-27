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

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: ROUTES.LOGIN });
}

export default function Dashboard() {
  const { user } = useLoaderData<{ user: UserWithId }>();

  return (
    <>
      <Header user={user} />
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {user.name}
          </h1>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </>
  );
}
