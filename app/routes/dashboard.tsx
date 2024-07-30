import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { redirect, useLoaderData, Link } from "@remix-run/react";
import { UserWithId, PartnerWithId } from "interfaces/user";
import { authenticator } from "services/auth/authService.server";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { Card } from "~/components/card";
import { Metric } from "~/components/metric";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const partner = {
    name: "Jamie Doe",
  };

  const userMetrics = {
    consecutiveDaysSignedIn: 12,
    totalJournals: 34,
    dateIdeasExplored: 10,
  };

  return json({ user, partner, userMetrics });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: ROUTES.LOGIN });
}

export default function Dashboard() {
  const { user, partner, userMetrics } = useLoaderData<{
    user: UserWithId;
    partner: PartnerWithId;
    userMetrics: any;
  }>();

  function getSuggestion(metrics: any) {
    if (metrics.consecutiveDaysSignedIn < 5) {
      return {
        text: "Don't forget to check in tomorrow!",
        link: "/journal",
        actionText: "Write in your journal",
      };
    } else if (metrics.totalJournals < 10) {
      return {
        text: "How about writing a journal entry today?",
        link: "/journal",
        actionText: "Write a journal entry",
      };
    } else if (metrics.dateIdeasExplored < 5) {
      return {
        text: "Why not explore some new date ideas?",
        link: "/date-ideas",
        actionText: "Explore date ideas",
      };
    } else {
      return {
        text: "Great job! Keep up the amazing work!",
        link: "/",
        actionText: "Explore more features",
      };
    }
  }

  const suggestion = getSuggestion(userMetrics);

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-blue-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Welcome, {user.name}
          </h1>
          <p className="text-lg md:text-xl mt-2">
            You and <span className="font-extrabold">{partner.name}</span> are
            on a journey together. Make the most out of your time with Anchor.
            Explore the features below to enhance your relationship.
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <Card
            title="Shared Journal"
            description="Write and share your thoughts and experiences."
            link="/journal"
            icon="📝"
          />
          <Card
            title="Date Night Ideas"
            description="Find fun and exciting date night ideas."
            link="/dates"
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

        <section className="max-w-screen-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Your Relationship Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 text-center">
            <Metric
              count={userMetrics.consecutiveDaysSignedIn}
              label={"Days in a Row Signed In"}
              insight={"Keep up the great work! Consistency is key."}
              colour="blue"
            />

            <Metric
              count={userMetrics.totalJournals}
              label={"Total Journals Written"}
              insight={"Your thoughts matter. Keep sharing them!"}
              colour="green"
            />

            <Metric
              count={userMetrics.dateIdeasExplored}
              label={"Date Ideas Explored"}
              insight={"Adventure awaits! Keep discovering new experiences."}
              colour="red"
            />
          </div>
          <div className="mt-8 text-center bg-gray-100 p-4 rounded-lg relative group">
            <h3 className="text-xl font-semibold text-gray-800">
              Our Recommendations{" "}
            </h3>
            <p className="text-gray-600 mt-2">{suggestion.text}</p>
            <Link
              to={suggestion.link}
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
            >
              {suggestion.actionText}
            </Link>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
