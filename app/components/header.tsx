import { Link } from "@remix-run/react";
import { UserWithId } from "interfaces/user";
import { ROUTES } from "~/constants";

type HeaderProps = {
  user: UserWithId;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center">
            <Link to="/dashboard">
              <span className="mr-1 md:mr-3">Anchor</span>
            </Link>

            <span
              role="img"
              aria-label="Anchor emoji"
              className="text-3xl md:text-4xl"
            >
              ⚓️
            </span>
          </h1>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <span className="hidden md:inline text-md md:text-lg font-medium text-white">
            Signed in as {user.name}
          </span>
          <Link
            to={ROUTES.SIGN_OUT}
            className="py-2 px-3 md:py-2 md:px-4 bg-white text-blue-600 rounded-full font-semibold shadow-sm hover:bg-gray-200 transition duration-300"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </header>
  );
}
