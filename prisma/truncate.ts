/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to truncate the database in production.");
  }

  if (process.env.CONFIRM_TRUNCATE_DB !== "1") {
    throw new Error("Database truncation is disabled. Re-run with CONFIRM_TRUNCATE_DB=1.");
  }

  const tables = await prisma.$queryRaw<Array<{ tableName: string }>>`
    SELECT table_name AS "tableName"
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name <> '_prisma_migrations'
  `;

  if (tables.length === 0) {
    console.log("No application tables found.");
    return;
  }

  const tableList = tables
    .map(({ tableName }) => `"public"."${tableName.replaceAll('"', '""')}"`)
    .join(", ");

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`);
  console.log(`Truncated ${tables.length} application table(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
