import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export type TUserRole = UserRole;

export default prisma;
