import { PrismaClient } from "../app/generated/prisma/client"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config({ path: ".env.production.local", override: true })
dotenv.config({ path: ".env.local" })

const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")

let prisma: PrismaClient

if (isPostgres) {
  const { PrismaNeonHttp } = require("@prisma/adapter-neon")
  const adapter = new PrismaNeonHttp(dbUrl)
  prisma = new PrismaClient({ adapter })
} else {
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
  const path = require("path")
  const dbPath = dbUrl.replace(/^file:/, "")
  const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath)
  const adapter = new PrismaBetterSqlite3({ url: absolutePath })
  prisma = new PrismaClient({ adapter })
}

async function main() {
  console.log("Seeding database...")

  const users = [1, 2, 3, 4, 5].flatMap((i) => {
    const email = process.env[`SEED_USER_${i}_EMAIL`]
    const password = process.env[`SEED_USER_${i}_PASSWORD`]
    const name = process.env[`SEED_USER_${i}_NAME`]
    if (!email || !password || !name) return []
    return [{ email, password, name }]
  })

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10)
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hash, name: u.name },
      create: { email: u.email, password: hash, name: u.name },
    })
    console.log(`  ✓ User: ${u.email}`)
  }

  const admin = await prisma.user.findFirst()
  if (!admin) throw new Error("No users found after seed")

  // Limpiar datos anteriores
  await prisma.meeting.deleteMany()
  await prisma.clientService.deleteMany()
  await prisma.client.deleteMany()
  console.log("  ✓ Datos anteriores eliminados")

  const clients = [
    // ─── ACTIVOS ────────────────────────────────────────────────────────────────
    {
      name: "Demian",
      company: "Demian",
      email: "demian@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 600,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-05"),
      lastPaidMonth: "Marzo 2026",
      notes: "Full Posi. GAds y Meta corriendo. Pago adelantado.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Patricia Rental",
      company: "Patricia Rental",
      email: "patricia@rental.com",
      status: "ACTIVO",
      monthlyAmount: 600,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-12"),
      lastPaidMonth: "Marzo 2026",
      notes: "Google Ads. Paga todo junto a principio de mes.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "D'Odorico",
      company: "D'Odorico",
      email: "dodorico@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 600,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2026-03-12"),
      lastPaidMonth: "Marzo 2026",
      notes: "Google Ads + CM. Paga mes vencido.",
      services: ["PAID_MEDIA", "SOCIAL_STRATEGY"],
    },
    {
      name: "Take Off",
      company: "Take Off",
      email: "takeoff@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 350,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-03"),
      lastPaidMonth: "Marzo 2026",
      notes: "CM + Meta Ads. Full Posi.",
      services: ["SOCIAL_STRATEGY", "PAID_MEDIA"],
    },
    {
      name: "Dyxoma",
      company: "Dyxoma",
      email: "dyxoma@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 200,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2026-03-16"),
      lastPaidMonth: "Marzo 2026",
      notes: "Meta Ads. Paga mes vencido.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Maxcer",
      company: "Maxcer",
      email: "maxcer@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 200,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-06"),
      lastPaidMonth: "Marzo 2026",
      notes: "Google Ads. Paga a principio de mes. Web realizada ($600 USD, ya abonada).",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Sustain",
      company: "Sustain",
      email: "sustain@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 50,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-31"),
      lastPaidMonth: "Marzo 2026",
      notes: null,
      services: ["OTRO"],
    },
    {
      name: "COA",
      company: "COA",
      email: "coa@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 50,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2026-03-06"),
      lastPaidMonth: "Marzo 2026",
      notes: "$50 USD mensuales. Enviar factura primeros días del mes, ref. al mes anterior.",
      services: ["OTRO"],
    },
    {
      name: "INB Seguros",
      company: "INB Seguros",
      email: "inb@seguros.com",
      status: "ACTIVO",
      monthlyAmount: 200,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2026-03-07"),
      lastPaidMonth: "Marzo 2026",
      notes: "Community Management. Paga mes vencido.",
      services: ["SOCIAL_STRATEGY"],
    },
    {
      name: "Estela Vital",
      company: "Mimi Estela",
      email: "estela@vital.com",
      status: "ACTIVO",
      monthlyAmount: 0,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2026-03-20"),
      lastPaidMonth: "Marzo 2026",
      notes: "A comisión: 5% sobre bruto vendido.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Cabañas Arcangeles",
      company: "Cabañas Arcangeles",
      email: "arcangeles@cabanas.com",
      status: "ACTIVO",
      monthlyAmount: 350,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-04"),
      lastPaidMonth: "Marzo 2026",
      notes: "Web + CM. Sitio abonado ($500 USD). CM mensual $200 USD.",
      services: ["SOCIAL_STRATEGY", "OTRO"],
    },
    {
      name: "Sanyser",
      company: "Sanyser",
      email: "sanyser@cliente.com",
      status: "ACTIVO",
      monthlyAmount: 0,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-03-27"),
      lastPaidMonth: "Marzo 2026",
      notes: "Landing page. Proyecto en ejecución.",
      services: ["OTRO"],
    },
    // ─── PAUSADOS ───────────────────────────────────────────────────────────────
    {
      name: "Vuotto",
      company: "Vuotto",
      email: "vuotto@cliente.com",
      status: "PAUSADO",
      monthlyAmount: 200,
      billingType: "POSTPAID",
      lastPaymentDate: new Date("2025-11-25"),
      lastPaidMonth: "Noviembre 2025",
      notes: "Google Ads. Dice no poder pagarlo. Seguimiento pendiente.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Luagro",
      company: "Luagro",
      email: "luagro@cliente.com",
      status: "PAUSADO",
      monthlyAmount: 200,
      billingType: "PREPAID",
      lastPaymentDate: null,
      lastPaidMonth: null,
      notes: "Suspendido. Cuotas $150/mes (Sep-Oct-Nov). Google Ads aún no empezó.",
      services: ["PAID_MEDIA"],
    },
    // ─── PERDIDOS ───────────────────────────────────────────────────────────────
    {
      name: "Kolors",
      company: "Kolors",
      email: "kolors@cliente.com",
      status: "PERDIDO",
      monthlyAmount: 300,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-01-13"),
      lastPaidMonth: "Enero 2026",
      notes: "Cancelado en enero. Google Ads admin $300/mes.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Lizze",
      company: "Lizze",
      email: "lizze@cliente.com",
      status: "PERDIDO",
      monthlyAmount: 300,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-01-13"),
      lastPaidMonth: "Enero 2026",
      notes: "Cancelado en enero. Sitio Tienda Nube + Google Ads.",
      services: ["PAID_MEDIA", "OTRO"],
    },
    {
      name: "Brennan",
      company: "Brennan Consulting",
      email: "brennan@consulting.com",
      status: "PERDIDO",
      monthlyAmount: 400,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2025-12-29"),
      lastPaidMonth: "Diciembre 2025",
      notes: "Cancelado en enero. Primera cuota $750 abonada. Segunda cuota pendiente.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Remax Premium III",
      company: "Remax Premium III",
      email: "remax@premium3.com",
      status: "PERDIDO",
      monthlyAmount: 300,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2025-10-16"),
      lastPaidMonth: "Octubre 2025",
      notes: "Meta Ads $300/mes. Inactivo desde octubre 2025.",
      services: ["PAID_MEDIA"],
    },
    {
      name: "Cerrame la 8",
      company: "Cerrame la 8",
      email: "cerramela8@cliente.com",
      status: "PERDIDO",
      monthlyAmount: 400,
      billingType: "PREPAID",
      lastPaymentDate: new Date("2026-02-06"),
      lastPaidMonth: "Febrero 2026",
      notes: "Proyecto terminado. Pago único web. Ofrecerle seguimiento.",
      services: ["OTRO"],
    },
  ]

  for (const c of clients) {
    const { services, ...clientData } = c
    const client = await prisma.client.upsert({
      where: { email: c.email },
      update: {},
      create: { ...clientData, assignedToId: admin.id },
    })
    for (const service of services) {
      await prisma.clientService.upsert({
        where: { id: `${client.id}-${service}` },
        update: {},
        create: { id: `${client.id}-${service}`, clientId: client.id, service },
      })
    }
    console.log(`  ✓ Cliente: ${c.company}`)
  }

  console.log("Seed completo.")
}

main().catch(console.error).finally(() => prisma.$disconnect())
