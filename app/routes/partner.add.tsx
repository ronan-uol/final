import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { UserWithId } from "interfaces/user";
import { authenticator } from "services/auth/authService.server";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { ROUTES } from "~/constants";
import { addPartnershipIdByEmail } from "~/services/user.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  if (user.partnershipId) {
    return redirect(ROUTES.DASHBOARD);
  }

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const formData = await request.formData();

  const { email } = Object.fromEntries(formData);

  if (email) {
    await addPartnershipIdByEmail(email as string, user.id);
    return redirect(ROUTES.DASHBOARD);
  }
}

export default function AddPartner() {
  const { user } = useLoaderData<{ user: UserWithId }>();

  return (
    <AuthenticatedLayout user={user}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">
            Add a Partner
          </h1>
          <p className="mt-4 text-gray-600 text-center">
            Go ahead and enter your partner's email to get started on Anchor. Or
            if your partner hasn't signed up yet, proceed to the{" "}
            <Link
              className="text-blue-500 hover:underline"
              to={ROUTES.DASHBOARD}
            >
              dashboard
            </Link>
            .
          </p>
          <Form method="post" className="space-y-6 flex flex-col items-center">
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
            >
              Add Partner
            </button>
          </Form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
