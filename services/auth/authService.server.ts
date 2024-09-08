import { prisma } from "services/db/db.server";
import bcrypt from "bcrypt";
import { getRandomNumber } from "utils/randomNumber";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "utils/createCookieSession";
import { FormStrategy } from "remix-auth-form";
import { AuthStrategies } from "~/enums";
import { User } from "@prisma/client";

type UserWithoutPassword = Omit<User, "password" | "passwordHash">;
type UserWithPassword = User & { password: string };

export async function createUser({
  name,
  email,
  password,
}: Partial<UserWithPassword>): Promise<UserWithoutPassword | undefined> {
  if (!name || !email || !password) {
    throw Error("Cannot create user without name, email, and password");
  }

  const saltRounds = getRandomNumber(10, 15);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastSignIn: true,
        createdOn: true,
        updatedOn: true,
        partnershipId: true,
      },
    });
  } catch (e) {
    console.error("Failed to create a user", e);
  }
}

export async function login(
  email: string,
  password: string
): Promise<UserWithoutPassword | undefined> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastSignIn: new Date() },
    });

    return updatedUser;
  } catch (e) {
    console.error("Failed to login", e);
  }
}

export const authenticator = new Authenticator<UserWithoutPassword>(
  sessionStorage
);

const loginStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const password = form.get("password");

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Bad Request");
  }

  const user = await login(email, password);

  if (!user) {
    throw new Error("Failed to login");
  }

  return user;
});

const createUserStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");

  const user = await createUser({
    email,
    password,
    name,
  } as Partial<UserWithPassword>);

  if (!user) {
    throw new Error("Failed to create a user");
  }

  return user;
});

authenticator
  .use(loginStrategy, AuthStrategies.LOGIN)
  .use(createUserStrategy, AuthStrategies.CREATE_USER);
