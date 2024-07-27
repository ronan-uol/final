import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  } else {
    return redirect(ROUTES.DASHBOARD);
  }
}

export default function Index() {
  return null;
}
