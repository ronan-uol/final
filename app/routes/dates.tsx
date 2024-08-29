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

  const dateIdeas = [
    {
      id: 1,
      title: "Picnic in the Park",
      description: "Pack some snacks and enjoy a sunny day in the park.",
      image:
        "https://plus.unsplash.com/premium_photo-1680706777258-553b9357eb04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Movie Night",
      description: "Pick a movie you both love, make some popcorn, and relax.",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Cooking Class",
      description:
        "Take a cooking class together and learn to make a new dish.",
      image:
        "https://plus.unsplash.com/premium_photo-1671377387797-8d3307a546a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Hiking",
      description: "Find a nearby trail and enjoy a day of hiking and nature.",
      image:
        "https://plus.unsplash.com/premium_photo-1661883853185-165f5869e6d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

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
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{idea.description}</p>
                  <div className="text-right">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
