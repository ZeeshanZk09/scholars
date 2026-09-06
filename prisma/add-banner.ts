import { prisma } from "@/server/db";

/* eslint-disable no-console */
async function seedBanners() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    throw new Error("Admin user not found. Please seed users first");
  }

  const banners = [
    {
      title: "Get 50% Off on All Computer Courses Today",
      subtitle: "Defense Day Special — Learn More, Pay Less",
      description:
        "Celebrate Defense Day with 50% off the monthly fee on all long-term and short-term computer courses. Limited seats available.",
      imageUrl:
        "/scholars-schools-official-images/02-national-day/6-september-defence-day-desktop.jpeg",
      linkUrl: "/computer-courses",
      ctaLabel: "Explore Computer Courses",
      startDate: new Date("2026-09-06T00:00:00.000Z"),
      endDate: new Date("2026-09-10T23:59:59.000Z"),
      status: "PUBLISHED" as const,
      displayOrder: 0,
    },
    {
      title: "Admissions Open for Session 2026-27",
      subtitle: "School, College, Coaching & Computer Courses",
      description:
        "Applications for the new academic session are now open. Submit your application before the deadline and secure a seat.",
      imageUrl: "/scholars-schools-official-images/07-science-museum/science-museum-008.jpg",
      linkUrl: "/admissions",
      ctaLabel: "Apply Now",
      startDate: new Date("2026-07-01T00:00:00.000Z"),
      endDate: new Date("2026-12-31T23:59:59.000Z"),
      status: "PUBLISHED" as const,
      displayOrder: 1,
    },
    {
      title: "Enroll in Professional Computer Courses",
      subtitle: "Short-term certifications for students and professionals",
      description:
        "Learn web development, office productivity and programming with hands-on, job-ready training.",
      imageUrl: "/scholars-schools-official-images/07-science-museum/science-museum-003.jpg",
      linkUrl: "/computer-courses",
      ctaLabel: "Explore Courses",
      startDate: null,
      endDate: null,
      status: "PUBLISHED" as const,
      displayOrder: 2,
    },
    {
      title: "Summer Prep Workshop",
      subtitle: "Coming soon — exam preparation bootcamps",
      description:
        "A dedicated summer programme for board exam preparation. Schedule will be announced closer to the date.",
      imageUrl:
        "/scholars-schools-official-images/01-classroom-activities/classroom-activity-009.jpg",
      linkUrl: "/coaching",
      ctaLabel: "Learn More",
      startDate: new Date("2027-01-01T00:00:00.000Z"),
      endDate: null,
      status: "PUBLISHED" as const,
      displayOrder: 3,
    },
    {
      title: "Winter Admission Drive",
      subtitle: "Last session's enrollment campaign",
      description:
        "An expired banner example — this should no longer appear on the public website.",
      imageUrl: "/scholars-schools-official-images/07-science-museum/science-museum-001.jpg",
      linkUrl: "/admissions",
      ctaLabel: "Learn More",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      status: "PUBLISHED" as const,
      displayOrder: 4,
    },
  ];

  await prisma.banner.deleteMany({});

  for (const banner of banners) {
    await prisma.banner.create({
      data: {
        ...banner,
        publishedAt: banner.status === "PUBLISHED" ? new Date() : null,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Banners (${banners.length})`);
}

seedBanners()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.log(error);
  });
