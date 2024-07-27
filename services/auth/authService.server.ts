import { prisma } from "services/db/db.server";
import bcrypt from "bcrypt";
import { getRandomNumber } from "utils/randomNumber";
import { User, UserWithId } from "interfaces/user";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "utils/createCookieSession";
import { FormStrategy } from "remix-auth-form";
import { AuthStrategies } from "~/enums";

export async function createUser({ name, email, password }: User): Promise<UserWithId | undefined> {
    const saltRounds = getRandomNumber(10, 15);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {

        return await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    } catch (e) {
        console.error("Failed to create a user", e)
    }
}

export async function login(email: string, password: string): Promise<UserWithId | undefined> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return;
        }

        return user;
    } catch (e) {
        console.error("Failed to login", e)
    }
}

export const authenticator = new Authenticator<UserWithId>(sessionStorage);


const loginStrategy = new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        throw new Error("Bad Request");
    }

    const user = await login(email, password);

    if (!user) {
        throw new Error("Failed to login");
    }

    return user;
})

const createUserStrategy = new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const name = form.get("name");

    const user = await createUser({ email, password, name } as User);

    if (!user) {
        throw new Error("Failed to create a user");
    }

    return user;
})

authenticator
    .use(
        loginStrategy,
        AuthStrategies.LOGIN
    ).use(
        createUserStrategy,
        AuthStrategies.CREATE_USER
    );