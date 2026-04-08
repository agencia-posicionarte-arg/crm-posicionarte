"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session
}

export async function createPayment(data: {
  clientId: string
  amountARS: number
  date: string
  month: string
  description?: string
}): Promise<{ error?: string }> {
  try {
    await requireSession()
    await prisma.payment.create({
      data: {
        clientId: data.clientId,
        amountARS: Number(data.amountARS),
        date: new Date(data.date),
        month: data.month,
        description: data.description || null,
      },
    })
    revalidatePath(`/clients/${data.clientId}`)
    revalidatePath("/")
  } catch (e) {
    console.error("[createPayment]", e)
    return { error: e instanceof Error ? e.message : String(e) }
  }
  return {}
}

export async function deletePayment(id: string, clientId: string): Promise<{ error?: string }> {
  try {
    await requireSession()
    await prisma.payment.delete({ where: { id } })
    revalidatePath(`/clients/${clientId}`)
    revalidatePath("/")
  } catch (e) {
    console.error("[deletePayment]", e)
    return { error: e instanceof Error ? e.message : String(e) }
  }
  return {}
}
