import { PrismaClient } from "@prisma/client";

// Crée toujours un nouveau client pour éviter les incohérences lors de changements de schéma en dev
export const prisma = new PrismaClient();



