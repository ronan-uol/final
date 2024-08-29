import { useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";
import { getDateIdeas } from "~/services/dates.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const dateIdeas = await getDateIdeas();

  return json({ user, dateIdeas });
}

export default function DateIdeas() {
  const { user, dateIdeas } = useLoaderData();

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-blue-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Date Night Ideas
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-600">
            Discover fun and exciting date night ideas to enjoy with your
            partner.
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dateIdeas.map((idea, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={idea.url}
                  alt={idea.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{idea.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
