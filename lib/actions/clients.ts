"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export type ClientFormData = {
  name: string
  company: string
  email: string
  phone?: string
  website?: string
  industry?: string
  status: string
  billingType: string
  paymentTiming: string
  monthlyAmount: number
  commissionRate?: number
  metaBudget?: number
  googleBudget?: number
  contractStartDate?: string
  lastContactDate?: string
  assignedToId?: string
  notes?: string
  services: string[]
}

async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session
}

export async function createClient(data: ClientFormData): Promise<{ error?: string }> {
  try {
    const session = await requireSession()
    const { services, lastContactDate, contractStartDate, ...rest } = data

    const client = await prisma.client.create({
      data: {
        ...rest,
        monthlyAmount: Number(rest.monthlyAmount),
        commissionRate: rest.commissionRate ? Number(rest.commissionRate) : null,
        metaBudget: rest.metaBudget ? Number(rest.metaBudget) : null,
        googleBudget: rest.googleBudget ? Number(rest.googleBudget) : null,
        lastContactDate: lastContactDate ? new Date(lastContactDate) : null,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : null,
        assignedToId: rest.assignedToId || session.user.id,
      },
    })

    if (services.length > 0) {
      try {
        await prisma.clientService.createMany({
          data: services.map((s) => ({ clientId: client.id, service: s })),
        })
      } catch (servicesError) {
        await prisma.client.delete({ where: { id: client.id } })
        throw servicesError
      }
    }

    revalidatePath("/clients")
    redirect(`/clients/${client.id}`)
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e
    console.error("[createClient]", e)
    return { error: e instanceof Error ? e.message : String(e) }
  }
  return {}
}

export async function updateClient(id: string, data: Partial<ClientFormData>) {
  await requireSession()
  const { services, lastContactDate, contractStartDate, ...rest } = data

  await prisma.client.update({
    where: { id },
    data: {
      ...rest,
      monthlyAmount: rest.monthlyAmount !== undefined ? Number(rest.monthlyAmount) : undefined,
      commissionRate: rest.commissionRate !== undefined ? Number(rest.commissionRate) : undefined,
      metaBudget: rest.metaBudget !== undefined ? Number(rest.metaBudget) : undefined,
      googleBudget: rest.googleBudget !== undefined ? Number(rest.googleBudget) : undefined,
      lastContactDate: lastContactDate ? new Date(lastContactDate) : undefined,
      contractStartDate: contractStartDate ? new Date(contractStartDate) : undefined,
    },
  })

  if (services !== undefined) {
    await prisma.clientService.deleteMany({ where: { clientId: id } })
    await prisma.clientService.createMany({
      data: services.map((s) => ({ clientId: id, service: s })),
    })
  }

  revalidatePath(`/clients/${id}`)
  revalidatePath("/clients")
  revalidatePath("/")
}

export async function deleteClient(id: string) {
  await requireSession()
  await prisma.client.delete({ where: { id } })
  revalidatePath("/clients")
  revalidatePath("/")
  redirect("/clients")
}

export async function updateClientNotes(id: string, notes: string) {
  await requireSession()
  await prisma.client.update({ where: { id }, data: { notes } })
  revalidatePath(`/clients/${id}`)
}

export async function updateClientStatus(id: string, status: string) {
  await requireSession()
  await prisma.client.update({ where: { id }, data: { status } })
  revalidatePath(`/clients/${id}`)
  revalidatePath("/clients")
  revalidatePath("/")
}
