/* eslint-disable */
import "dotenv/config";
import { prisma } from "./src/server/db";

async function run() {
  const out: string[] = [];
  const withCatch = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const r = await fn();
      out.push(`${label} OK => ${JSON.stringify(r)?.slice(0, 200)}`);
    } catch (e: any) {
      const msg = e?.message || String(e);
      out.push(`${label} ERROR => ${msg.slice(0, 400)}`);
    }
  };

  await withCatch("contactMessage.count", () => prisma.contactMessage.count());
  await withCatch("user.findUnique(admin)", () =>
    prisma.user.findUnique({
      where: { email: "admin@scholarschool.edu.pk" },
      select: { id: true, email: true, role: true, status: true },
    }),
  );
  await withCatch("blogPost.findMany(published)", () =>
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, take: 5 }),
  );
  await withCatch("contactMessage.create", () =>
    prisma.contactMessage.create({
      data: {
        name: "Diag",
        email: `diag-${Date.now()}@example.com`,
        phone: null,
        subject: null,
        message: "diag",
      },
      select: { id: true },
    }),
  );

  console.log(out.join("\n"));
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
