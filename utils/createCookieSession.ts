import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "auth_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true, // only allow cookie to be set via http
        secrets: [process.env.COOKIE_SECRET as string],
        secure: process.env.NODE_ENV === "production",
    },
});

export const { getSession, commitSession, destroySession } = sessionStorage;