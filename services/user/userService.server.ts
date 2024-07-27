import { prisma } from "services/db/db.server";

export async function getUser(id: string) {
    try {
        return await prisma.user.findUnique({
            where: {
                id
            }
        });


    } catch (e) {
        console.error("Failed to get user", e)
    }
}