import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    uSER: {
      password: true,
    },
  },
});

export default prisma;
