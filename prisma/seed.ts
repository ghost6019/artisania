import {
  AccountType,
  GlobalRole,
  InvoiceStatus,
  MembershipRole,
  PrismaClient,
  QuoteStatus,
  ReviewStatus,
  ServiceRequestStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed démo Artisania…");

  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.companyMembership.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Demo2026!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@artisania.local",
      passwordHash,
      firstName: "Alice",
      lastName: "Admin",
      globalRole: GlobalRole.PLATFORM_ADMIN,
      accountType: AccountType.BOTH,
    },
  });

  const artisanUser = await prisma.user.create({
    data: {
      email: "artisan@artisania.local",
      passwordHash,
      firstName: "Marc",
      lastName: "Dupont",
      phone: "06 12 34 56 78",
      accountType: AccountType.ARTISAN,
    },
  });

  const individual = await prisma.user.create({
    data: {
      email: "particulier@artisania.local",
      passwordHash,
      firstName: "Sophie",
      lastName: "Martin",
      phone: "06 98 76 54 32",
      accountType: AccountType.INDIVIDUAL,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Dupont Électricité",
      legalName: "Dupont Électricité SARL",
      siret: "12345678901234",
      email: "contact@dupont-elec.demo",
      phone: "01 23 45 67 89",
      addressLine1: "12 rue des Artisans",
      city: "Lyon",
      postalCode: "69003",
      description:
        "[DÉMO] Entreprise d'électricité générale et dépannage sur Lyon et agglomération.",
      isVerified: true,
      isActive: true,
    },
  });

  await prisma.companyMembership.create({
    data: {
      userId: artisanUser.id,
      companyId: company.id,
      role: MembershipRole.OWNER,
      isDefault: true,
    },
  });

  const profile = await prisma.artisanProfile.create({
    data: {
      userId: artisanUser.id,
      companyId: company.id,
      slug: "dupont-electricite-lyon",
      trade: "Électricien",
      trades: ["Électricien", "Dépannage"],
      bio: "[DÉMO] Électricien qualifié, interventions rapides et devis clairs.",
      city: "Lyon",
      postalCode: "69003",
      serviceArea: "Lyon et Grand Lyon",
      yearsExperience: 12,
      isPublic: true,
      isFeatured: true,
      ratingAvg: 4.8,
      ratingCount: 2,
    },
  });

  const plumber = await prisma.user.create({
    data: {
      email: "plombier@artisania.local",
      passwordHash,
      firstName: "Nadia",
      lastName: "Benali",
      accountType: AccountType.ARTISAN,
    },
  });

  const plumberCompany = await prisma.company.create({
    data: {
      name: "Benali Plomberie",
      email: "contact@benali-plomberie.demo",
      city: "Villeurbanne",
      postalCode: "69100",
      description: "[DÉMO] Plomberie, chauffage et dépannage urgence.",
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.companyMembership.create({
    data: {
      userId: plumber.id,
      companyId: plumberCompany.id,
      role: MembershipRole.INDEPENDENT,
      isDefault: true,
    },
  });

  await prisma.artisanProfile.create({
    data: {
      userId: plumber.id,
      companyId: plumberCompany.id,
      slug: "benali-plomberie-villeurbanne",
      trade: "Plombier",
      trades: ["Plombier", "Chauffagiste"],
      bio: "[DÉMO] Plombière indépendante, devis sous 24h.",
      city: "Villeurbanne",
      postalCode: "69100",
      yearsExperience: 8,
      isPublic: true,
      ratingAvg: 4.5,
      ratingCount: 1,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      companyId: company.id,
      ownerUserId: artisanUser.id,
      firstName: "Jean",
      lastName: "Leroy",
      email: "jean.leroy@demo.local",
      phone: "06 11 22 33 44",
      city: "Lyon",
      postalCode: "69006",
      addressLine1: "5 avenue de la République",
      notes: "[DÉMO] Client régulier — tableau électrique.",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyId: company.id,
      ownerUserId: artisanUser.id,
      firstName: "Claire",
      lastName: "Petit",
      email: "claire.petit@demo.local",
      phone: "06 55 44 33 22",
      city: "Caluire-et-Cuire",
      isProspect: true,
      notes: "[DÉMO] Prospect — rénovation cuisine.",
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 30, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(14, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(15, 0, 0, 0);

  await prisma.appointment.createMany({
    data: [
      {
        companyId: company.id,
        customerId: customer1.id,
        title: "[DÉMO] Diagnostic tableau",
        startsAt: todayStart,
        endsAt: todayEnd,
        status: "CONFIRMED",
        location: "5 avenue de la République, Lyon",
      },
      {
        companyId: company.id,
        customerId: customer2.id,
        title: "[DÉMO] Visite devis cuisine",
        startsAt: tomorrow,
        endsAt: tomorrowEnd,
        status: "SCHEDULED",
        location: "Caluire-et-Cuire",
      },
    ],
  });

  await prisma.intervention.createMany({
    data: [
      {
        companyId: company.id,
        customerId: customer1.id,
        title: "[DÉMO] Remplacement disjoncteur",
        status: "SCHEDULED",
        scheduledAt: tomorrow,
        city: "Lyon",
        postalCode: "69006",
      },
      {
        companyId: company.id,
        customerId: customer2.id,
        title: "[DÉMO] Mise aux normes cuisine",
        status: "PENDING",
        city: "Caluire-et-Cuire",
      },
    ],
  });

  const quote = await prisma.quote.create({
    data: {
      companyId: company.id,
      customerId: customer2.id,
      number: "D-2026-001",
      title: "[DÉMO] Devis rénovation électrique cuisine",
      status: QuoteStatus.SENT,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotalCents: 120000,
      taxCents: 24000,
      totalCents: 144000,
      items: {
        create: [
          {
            description: "Fourniture et pose prises",
            quantity: 8,
            unitPriceCents: 4500,
            position: 0,
          },
          {
            description: "Mise à la terre",
            quantity: 1,
            unitPriceCents: 84000,
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      companyId: company.id,
      customerId: customer1.id,
      number: "F-2026-001",
      title: "[DÉMO] Facture dépannage",
      status: InvoiceStatus.SENT,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      subtotalCents: 18000,
      taxCents: 3600,
      totalCents: 21600,
      items: {
        create: [
          {
            description: "Main d'œuvre dépannage (2h)",
            quantity: 2,
            unitPriceCents: 9000,
            position: 0,
          },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      companyId: company.id,
      customerId: customer1.id,
      number: "F-2026-002",
      title: "[DÉMO] Facture payée — installation LED",
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
      subtotalCents: 45000,
      taxCents: 9000,
      totalCents: 54000,
      items: {
        create: [
          {
            description: "Installation éclairage LED",
            quantity: 1,
            unitPriceCents: 45000,
            position: 0,
          },
        ],
      },
    },
  });

  await prisma.serviceRequest.create({
    data: {
      companyId: company.id,
      artisanProfileId: profile.id,
      authorId: individual.id,
      title: "[DÉMO] Prise qui disjoncte",
      description:
        "Depuis hier, une prise de la cuisine fait disjoncter le tableau. Besoin d'un diagnostic rapide.",
      trade: "Électricien",
      city: "Lyon",
      postalCode: "69003",
      phone: "06 98 76 54 32",
      email: individual.email,
      status: ServiceRequestStatus.PENDING,
    },
  });

  await prisma.review.createMany({
    data: [
      {
        companyId: company.id,
        artisanProfileId: profile.id,
        authorId: individual.id,
        authorName: "Sophie M.",
        rating: 5,
        comment: "[DÉMO] Intervention rapide et soignée.",
        status: ReviewStatus.APPROVED,
      },
      {
        companyId: company.id,
        artisanProfileId: profile.id,
        authorName: "Client anonyme",
        rating: 4,
        comment: "[DÉMO] Bon devis, délais respectés.",
        status: ReviewStatus.APPROVED,
      },
    ],
  });

  console.log("✅ Seed terminé.");
  console.log("Comptes démo (mot de passe : Demo2026!) :");
  console.log(`  Admin        : ${admin.email}`);
  console.log(`  Artisan      : ${artisanUser.email}`);
  console.log(`  Particulier  : ${individual.email}`);
  console.log(`  Plombier     : ${plumber.email}`);
  console.log(`Quote démo     : ${quote.number}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
