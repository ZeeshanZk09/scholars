/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Users ----
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@scholarschool.edu.pk" },
    update: {},
    create: {
      name: "Scholar Admin",
      email: "admin@scholarschool.edu.pk",
      role: "SUPER_ADMIN",
      passwordHash: adminPasswordHash,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);

  // Additional role users for authorization testing.
  const cmsAdminPasswordHash = await bcrypt.hash("CmsAdmin@123", 12);
  const editorPasswordHash = await bcrypt.hash("Editor@123", 12);

  const cmsAdmin = await prisma.user.upsert({
    where: { email: "cms@scholarschool.edu.pk" },
    update: {},
    create: {
      name: "CMS Administrator",
      email: "cms@scholarschool.edu.pk",
      role: "ADMIN",
      passwordHash: cmsAdminPasswordHash,
      status: "ACTIVE",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@scholarschool.edu.pk" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@scholarschool.edu.pk",
      role: "EDITOR",
      passwordHash: editorPasswordHash,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin user: ${cmsAdmin.email}`);
  console.log(`✅ Editor user: ${editor.email}`);

  // ---- Academic Session ----
  const session = await prisma.academicSession.upsert({
    where: { slug: "2026-27" },
    update: {},
    create: {
      name: "2026-27",
      slug: "2026-27",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2027-03-31"),
      isActive: true,
      createdById: admin.id,
    },
  });

  console.log(`✅ Academic session: ${session.name}`);

  // ---- School Levels & Classes ----
  const schoolStructure = [
    {
      name: "Foundation",
      description:
        "A caring, play-based start that builds early literacy, numeracy and confidence.",
      classes: [
        {
          name: "Nursery",
          description: "Early learning through play, rhymes and motor activities.",
          eligibility: "Age 3 by March 31",
        },
        {
          name: "KG",
          description: "Foundations of reading, writing and numbers.",
          eligibility: "Age 4 by March 31",
        },
        {
          name: "Prep",
          description: "Preparing children for formal primary schooling.",
          eligibility: "Age 5 by March 31",
        },
      ],
    },
    {
      name: "Primary",
      description:
        "A broad curriculum that strengthens core subjects and builds good study habits.",
      classes: [
        {
          name: "Grade 1",
          description: "Formal literacy, numeracy and basic science.",
          eligibility: "Age 6 by March 31",
        },
        {
          name: "Grade 2",
          description: "Reading fluency, arithmetic and general knowledge.",
          eligibility: "Age 7 by March 31",
        },
        {
          name: "Grade 3",
          description: "Advanced reading, writing and mathematics.",
          eligibility: "Age 8 by March 31",
        },
        {
          name: "Grade 4",
          description: "Introduction to science, social studies and English.",
          eligibility: "Age 9 by March 31",
        },
        {
          name: "Grade 5",
          description: "Consolidating core subjects before middle school.",
          eligibility: "Age 10 by March 31",
        },
      ],
    },
    {
      name: "Middle",
      description:
        "A challenging curriculum with science, arts and growing co-curricular involvement.",
      classes: [
        {
          name: "Grade 6",
          description: "Deeper study of science, mathematics and languages.",
          eligibility: "Age 11 by March 31",
        },
        {
          name: "Grade 7",
          description: "Broader subjects with more independent learning.",
          eligibility: "Age 12 by March 31",
        },
        {
          name: "Grade 8",
          description: "Preparation for the secondary stage.",
          eligibility: "Age 13 by March 31",
        },
      ],
    },
    {
      name: "Secondary",
      description: "Focused preparation for board examinations in Science and General groups.",
      classes: [
        {
          name: "Grade 9",
          description: "Start of Matric with Science and General groups.",
          eligibility: "Completed Grade 8",
        },
        {
          name: "Grade 10",
          description: "Board examination year with test series and revision.",
          eligibility: "Completed Grade 9",
        },
      ],
    },
  ];

  await prisma.schoolClass.deleteMany({});
  await prisma.academicLevel.deleteMany({});

  for (const [levelIndex, levelData] of schoolStructure.entries()) {
    const levelSlug = levelData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const level = await prisma.academicLevel.create({
      data: {
        name: levelData.name,
        slug: levelSlug,
        description: levelData.description,
        status: "PUBLISHED",
        displayOrder: levelIndex,
        createdById: admin.id,
      },
    });

    for (const [classIndex, classData] of levelData.classes.entries()) {
      await prisma.schoolClass.create({
        data: {
          name: classData.name,
          slug: classData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: classData.description,
          eligibility: classData.eligibility,
          learningOutcomes: `By the end of ${classData.name}, students build a strong foundation in core subjects with confidence and curiosity.`,
          levelId: level.id,
          status: "PUBLISHED",
          displayOrder: levelIndex * 100 + classIndex,
          createdById: admin.id,
        },
      });
    }
  }

  console.log(
    `✅ School levels (${schoolStructure.length}) & classes (${schoolStructure.reduce((total, level) => total + level.classes.length, 0)})`
  );

  // ---- College Programs ----
  const collegePrograms = [
    {
      name: "FSc Pre-Medical",
      groupName: "Science",
      subjects: "Biology, Chemistry, Physics, English",
      eligibility: "Matric (Science) with 60% or above",
      description:
        "A two-year intermediate program preparing students for MBBS and other medical careers.",
      admissionRequirements:
        "Matric (Science) certificate, B-Form, character certificate, photographs",
    },
    {
      name: "FSc Pre-Engineering",
      groupName: "Science",
      subjects: "Mathematics, Chemistry, Physics, English",
      eligibility: "Matric (Science) with 60% or above",
      description:
        "A two-year intermediate program building the foundation for engineering and technology careers.",
      admissionRequirements:
        "Matric (Science) certificate, B-Form, character certificate, photographs",
    },
    {
      name: "ICS Computer Science",
      groupName: "Computer Science",
      subjects: "Computer Science, Mathematics, Physics, English",
      eligibility: "Matric (Science) with 50% or above",
      description:
        "An intermediate program for students aiming at computing, IT and software careers.",
      admissionRequirements: "Matric certificate, B-Form, character certificate, photographs",
    },
    {
      name: "I.Com Commerce",
      groupName: "Commerce",
      subjects: "Accounting, Business Studies, Economics, English",
      eligibility: "Matric with 50% or above",
      description:
        "A two-year commerce program preparing students for business, finance and accounting degrees.",
      admissionRequirements: "Matric certificate, B-Form, character certificate, photographs",
    },
  ];

  for (const [index, p] of collegePrograms.entries()) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await prisma.collegeProgram.upsert({
      where: { slug },
      update: {
        groupName: p.groupName,
        subjects: p.subjects,
        eligibility: p.eligibility,
        description: p.description,
        admissionRequirements: p.admissionRequirements,
        duration: "2 Years",
      },
      create: {
        name: p.name,
        slug,
        groupName: p.groupName,
        description: p.description,
        subjects: p.subjects,
        eligibility: p.eligibility,
        duration: "2 Years",
        admissionRequirements: p.admissionRequirements,
        status: "PUBLISHED",
        displayOrder: index,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ College programs (${collegePrograms.length})`);

  // ---- Coaching Programs ----
  const coachingPrograms = [
    {
      name: "Matric Coaching",
      category: "Board Exams",
      subjects:
        "Science Group: Physics, Chemistry, Biology, Mathematics; General Group: All subjects",
      targetStudents: "Students of Scholar School and external",
      duration: "Annual",
      timing: "Evening batches · 4:00 PM – 7:00 PM",
      feeInformation: "Contact office for batch-wise fee",
      admissionStatus: "Open",
    },
    {
      name: "Intermediate Coaching",
      category: "Board Exams",
      subjects: "Pre-Medical, Pre-Engineering, ICS & I.Com subjects",
      targetStudents: "First Year and Second Year students",
      duration: "Annual",
      timing: "Evening batches · 4:00 PM – 8:00 PM",
      feeInformation: "Contact office for batch-wise fee",
      admissionStatus: "Open",
    },
    {
      name: "Entry Test Preparation",
      category: "Test Prep",
      subjects: "Biology, Chemistry, Physics, Mathematics",
      targetStudents: "Students preparing for medical & engineering entry tests",
      duration: "Crash + Revision",
      timing: "Morning & Evening sessions",
      feeInformation: "Contact office for course fee",
      admissionStatus: "Limited Seats",
    },
  ];

  for (const [index, p] of coachingPrograms.entries()) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await prisma.coachingProgram.upsert({
      where: { slug },
      update: {
        category: p.category,
        subjects: p.subjects,
        targetStudents: p.targetStudents,
        duration: p.duration,
        timing: p.timing,
        feeInformation: p.feeInformation,
        admissionStatus: p.admissionStatus,
      },
      create: {
        name: p.name,
        slug,
        category: p.category,
        description: `${p.name} for ${p.category}`,
        targetStudents: p.targetStudents,
        subjects: p.subjects,
        duration: p.duration,
        timing: p.timing,
        feeInformation: p.feeInformation,
        admissionStatus: p.admissionStatus,
        status: "PUBLISHED",
        displayOrder: index,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Coaching programs (${coachingPrograms.length})`);

  // ---- Computer Courses ----
  const computerCourses = [
    {
      name: "Web Development",
      duration: "6 Months",
      eligibility: "Matric & above · No prior coding experience required",
      outline:
        "HTML & CSS\nResponsive Web Design\nJavaScript & ES6+\nReact & Next.js\nAPIs & Databases\nPortfolio Project & Deployment",
      timing: "Evening batches · 5:00 PM – 7:00 PM (Mon–Wed) & Weekend batches",
      fee: "PKR 35,000 (payable in instalments)",
      admissionStatus: "Admissions Open",
    },
    {
      name: "Graphic Design",
      duration: "3 Months",
      eligibility: "Minimum Matric · Basic computer literacy",
      outline:
        "Design Principles & Colour Theory\nTypography & Layout\nAdobe Photoshop & Illustrator\nLogo & Brand Identity Design\nSocial Media & Print Design",
      timing: "Evening batches · 4:00 PM – 6:00 PM (Tue–Thu) & Weekend batches",
      fee: "PKR 20,000 (payable in instalments)",
      admissionStatus: "Admissions Open",
    },
    {
      name: "MS Office Essentials",
      duration: "2 Months",
      eligibility: "For students, professionals & job seekers",
      outline:
        "Word: Documents & Mail Merge\nExcel: Formulas, Charts & Data Analysis\nPowerPoint: Effective Presentations\nOutlook & Productivity Tips",
      timing: "Morning & evening batches available",
      fee: "PKR 12,000",
      admissionStatus: "Limited Seats",
    },
  ];

  for (const [index, c] of computerCourses.entries()) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await prisma.computerCourse.upsert({
      where: { slug },
      update: {
        shortDescription: `${c.name} course`,
        detailedDescription: `Professional ${c.name} training with practical projects.`,
        duration: c.duration,
        eligibility: c.eligibility,
        courseOutline: c.outline,
        timing: c.timing,
        fee: c.fee,
        admissionStatus: c.admissionStatus,
        instructor: "Senior Faculty",
      },
      create: {
        name: c.name,
        slug,
        shortDescription: `${c.name} course`,
        detailedDescription: `Professional ${c.name} training with practical projects.`,
        duration: c.duration,
        eligibility: c.eligibility,
        courseOutline: c.outline,
        timing: c.timing,
        fee: c.fee,
        admissionStatus: c.admissionStatus,
        instructor: "Senior Faculty",
        isFeatured: index === 0,
        status: "PUBLISHED",
        displayOrder: index,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Computer courses (${computerCourses.length})`);

  // ---- Admission Period ----
  await prisma.admissionPeriod.upsert({
    where: { sessionId_category: { sessionId: session.id, category: "SCHOOL" } },
    update: {},
    create: {
      sessionId: session.id,
      category: "SCHOOL",
      title: "School Admissions 2026-27",
      description: "Admissions open for all classes Nursery to Class 10.",
      openingDate: new Date("2026-04-01"),
      closingDate: new Date("2026-06-30"),
      status: "OPEN",
      isActive: true,
      createdById: admin.id,
      requirements: {
        create: {
          eligibility: "Age according to class policy",
          requiredDocuments: "B-Form, Previous report card, photos",
          applicationProcess: "Submit form online or at school office",
          feeInformation: "Contact office for fee structure",
        },
      },
    },
  });

  console.log("✅ Admission period (School)");

  // ---- Admission Period (College) ----
  await prisma.admissionPeriod.upsert({
    where: { sessionId_category: { sessionId: session.id, category: "COLLEGE" } },
    update: {},
    create: {
      sessionId: session.id,
      category: "COLLEGE",
      title: "College Admissions 2026-27",
      description: "Admissions open for First Year in all Intermediate groups.",
      openingDate: new Date("2026-05-01"),
      closingDate: new Date("2026-07-31"),
      status: "OPEN",
      isActive: true,
      createdById: admin.id,
      requirements: {
        create: {
          eligibility: "Matric (Science) with 60% or above for Science groups",
          requiredDocuments: "Matric certificate, B-Form, photographs",
          applicationProcess: "Submit form online or at the college office",
          importantDates: "Admission test for Science groups, when applicable",
          feeInformation: "Contact office for fee structure",
        },
      },
    },
  });

  console.log("✅ Admission period (College)");

  // ---- Facilities ----
  const facilities = [
    {
      name: "Computer Lab",
      icon: "computer",
      imageUrl: "https://placehold.co/800x450/1e3a5f/ffffff/png?text=Computer+Lab",
    },
    {
      name: "Science Lab",
      icon: "lab",
      imageUrl: "https://placehold.co/800x450/0f766e/ffffff/png?text=Science+Lab",
    },
    {
      name: "Library",
      icon: "library",
      imageUrl: "https://placehold.co/800x450/7c3aed/ffffff/png?text=Library",
    },
    {
      name: "Classrooms",
      icon: "classroom",
      imageUrl: "https://placehold.co/800x450/991b1b/ffffff/png?text=Classrooms",
    },
    {
      name: "Sports Ground",
      icon: "sports",
      imageUrl: "https://placehold.co/800x450/b45309/ffffff/png?text=Sports+Ground",
    },
  ];

  for (const [index, facility] of facilities.entries()) {
    const slug = facility.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await prisma.facility.upsert({
      where: { slug },
      update: {
        icon: facility.icon,
        imageUrl: facility.imageUrl,
        description: `Modern ${facility.name.toLowerCase()} facility at Scholar School`,
      },
      create: {
        name: facility.name,
        slug,
        description: `Modern ${facility.name.toLowerCase()} facility at Scholar School`,
        icon: facility.icon,
        imageUrl: facility.imageUrl,
        status: "PUBLISHED",
        displayOrder: index,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Facilities (${facilities.length})`);

  // ---- Banners ----
  const banners = [
    {
      title: "Admissions Open for Session 2026-27",
      subtitle: "School, College, Coaching & Computer Courses",
      description:
        "Applications for the new academic session are now open. Submit your application before the deadline and secure a seat.",
      imageUrl: "https://placehold.co/1600x600/1e3a5f/ffffff/png?text=Admissions+Open",
      linkUrl: "/admissions",
      ctaLabel: "Apply Now",
      startDate: new Date("2026-07-01T00:00:00.000Z"),
      endDate: new Date("2026-12-31T23:59:59.000Z"),
      status: "PUBLISHED" as const,
      displayOrder: 0,
    },
    {
      title: "Enroll in Professional Computer Courses",
      subtitle: "Short-term certifications for students and professionals",
      description:
        "Learn web development, office productivity and programming with hands-on, job-ready training.",
      imageUrl: "https://placehold.co/1600x600/0f766e/ffffff/png?text=Computer+Courses",
      linkUrl: "/computer-courses",
      ctaLabel: "Explore Courses",
      startDate: null,
      endDate: null,
      status: "PUBLISHED" as const,
      displayOrder: 1,
    },
    {
      title: "Summer Prep Workshop",
      subtitle: "Coming soon — exam preparation bootcamps",
      description:
        "A dedicated summer programme for board exam preparation. Schedule will be announced closer to the date.",
      imageUrl: "https://placehold.co/1600x600/7c3aed/ffffff/png?text=Summer+Workshop",
      linkUrl: "/coaching",
      ctaLabel: "Learn More",
      startDate: new Date("2027-01-01T00:00:00.000Z"),
      endDate: null,
      status: "PUBLISHED" as const,
      displayOrder: 2,
    },
    {
      title: "Winter Admission Drive",
      subtitle: "Last session's enrollment campaign",
      description:
        "An expired banner example — this should no longer appear on the public website.",
      imageUrl: "https://placehold.co/1600x600/991b1b/ffffff/png?text=Winter+Drive",
      linkUrl: "/admissions",
      ctaLabel: "Learn More",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      status: "PUBLISHED" as const,
      displayOrder: 3,
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

  // ---- Testimonials ----
  const testimonials = [
    { name: "Ahmed Raza", role: "Student", type: "STUDENT" as const, rating: 5 },
    { name: "Fatima Noor", role: "Parent", type: "PARENT" as const, rating: 5 },
  ];

  await prisma.testimonial.deleteMany({});

  for (const [index, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        role: t.role,
        type: t.type,
        message: `Scholar School has been a wonderful experience for ${t.role.toLowerCase()} ${t.name}.`,
        rating: t.rating,
        status: "PUBLISHED",
        displayOrder: index,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Testimonials (${testimonials.length})`);

  // ---- Blog Categories, Tags, Posts ----
  const categories = ["Education", "Career Guidance", "Institutional Activities"];
  const categoryRecords = [];

  for (const [index, name] of categories.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const record = await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug, status: "PUBLISHED", displayOrder: index, createdById: admin.id },
    });
    categoryRecords.push(record);
  }

  const tags = ["exams", "science", "computer"];
  for (const name of tags) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.blogTag.upsert({
      where: { slug },
      update: {},
      create: { name, slug, createdById: admin.id },
    });
  }

  const post = await prisma.blogPost.upsert({
    where: { slug: "welcome-to-scholar-school" },
    update: {},
    create: {
      title: "Welcome to Scholar Higher Secondary School",
      slug: "welcome-to-scholar-school",
      excerpt: "An introduction to our academic programs and admissions.",
      content:
        "Scholar Higher Secondary School welcomes new admissions for the 2026-27 session with programs across school, college, coaching and computer courses.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      createdById: admin.id,
    },
  });

  await prisma.seoMeta.upsert({
    where: { blogPostId: post.id },
    update: {},
    create: {
      blogPostId: post.id,
      seoTitle: "Welcome to Scholar Higher Secondary School | Admissions 2026-27",
      metaDescription:
        "An introduction to the academic programs and admissions at Scholar Higher Secondary School, College, Coaching and Computer Courses.",
      keywords: "scholar school, higher secondary school, admissions, college, coaching",
      canonicalUrl: "https://scholarschool.edu.pk/blogs/welcome-to-scholar-school",
      ogTitle: "Welcome to Scholar Higher Secondary School",
      ogDescription: "New admissions for the 2026-27 session are now open.",
      robots: "index, follow",
    },
  });

  await prisma.blogPostCategory.createMany({
    data: categoryRecords.map((category) => ({
      blogPostId: post.id,
      categoryId: category.id,
    })),
    skipDuplicates: true,
  });

  const firstTag = await prisma.blogTag.findFirst({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });

  if (firstTag) {
    await prisma.blogPostTag.upsert({
      where: { blogPostId_tagId: { blogPostId: post.id, tagId: firstTag.id } },
      update: {},
      create: { blogPostId: post.id, tagId: firstTag.id },
    });
  }

  console.log("✅ Blog categories, tags & a post");

  // ---- Pages ----
  const pages = [
    { title: "About Us", slug: "about" },
    { title: "Admissions", slug: "admissions" },
    { title: "Contact Us", slug: "contact" },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        title: page.title,
        slug: page.slug,
        content: `${page.title} page content.`,
        status: "PUBLISHED",
        publishedAt: new Date(),
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Pages (${pages.length})`);

  // ---- Navigation ----
  const navItems = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Academics", url: "/academics" },
    { label: "Admissions", url: "/admissions" },
    { label: "Blog", url: "/blogs" },
    { label: "Contact", url: "/contact" },
  ];

  await prisma.navigationItem.deleteMany({ where: { position: "main" } });

  for (const [index, item] of navItems.entries()) {
    await prisma.navigationItem.create({
      data: {
        label: item.label,
        url: item.url,
        position: "main",
        displayOrder: index,
        status: "PUBLISHED",
      },
    });
  }

  console.log(`✅ Navigation items (${navItems.length})`);

  // ---- Site Settings ----
  // Keys intentionally match the fields read by `getSiteSettings()` so that
  // edits made in the admin CMS surface on the public website (footer,
  // contact page, structured data).
  const settings = [
    { key: "name", value: "Scholar", group: "general" },
    { key: "fullName", value: "Scholar Higher Secondary School", group: "general" },
    { key: "tagline", value: "Quality Education for Tomorrow's Leaders", group: "general" },
    { key: "email", value: "info@scholarschool.edu.pk", group: "contact" },
    { key: "phone", value: "+92 300 0000000", group: "contact" },
    { key: "phoneHref", value: "+923000000000", group: "contact" },
    { key: "address", value: "Main Boulevard, City, Pakistan", group: "contact" },
    { key: "applyUrl", value: "/admissions/apply", group: "general" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value, group: s.group },
    });
  }

  console.log(`✅ Site settings (${settings.length})`);

  console.log("🎉 Database seeding completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
