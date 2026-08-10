import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const env = config().parsed || {};
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
  url: env.DATABASE_URL || "",
  },
});
