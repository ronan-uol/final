import React from "react";
import { Header } from "./header";
import { UserWithId } from "interfaces/user";

type LayoutProps = {
  user: UserWithId;
  children: React.ReactNode;
};

export function AuthenticatedLayout({ user, children }: LayoutProps) {
  return (
    <>
      <Header user={user} />
      <main>{children}</main>
    </>
  );
}
