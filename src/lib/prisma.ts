import config from "@/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "src/generated/client";

const adapter = new PrismaPg({
  connectionString: config.database_url,
});

const prisma = new PrismaClient({
  adapter,
  omit: {
    uSER: {
      password: true,
    },
  },
});

export default prisma;
