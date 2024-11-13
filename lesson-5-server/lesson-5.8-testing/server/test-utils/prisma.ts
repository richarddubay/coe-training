import { prisma } from "../utils/prisma";

const prismaForTests = prisma as any;

export { prismaForTests };
