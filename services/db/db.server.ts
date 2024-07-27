import { PrismaClient } from "@prisma/client";

import { remember } from "@epic-web/remember";

// Remember is used to create a singleton here so that the prisma client is only created once
const prisma = remember("prisma", () => new PrismaClient());
prisma.$connect();

export { prisma };
