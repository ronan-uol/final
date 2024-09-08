import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.logout(request, { redirectTo: ROUTES.LOGIN });

  return redirect(ROUTES.LOGIN);
}

export default function Logout() {
  // This component will never actually render
  return null;
}
