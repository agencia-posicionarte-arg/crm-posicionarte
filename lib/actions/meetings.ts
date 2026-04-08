"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session
}

export async function createMeeting(data: {
  title: string
  scheduledAt: string
  clientId: string
  notes?: string
}): Promise<{ error?: string }> {
  try {
    const session = await requireSession()
    await prisma.meeting.create({
      data: {
        title: data.title,
        scheduledAt: new Date(data.scheduledAt),
        clientId: data.clientId,
        notes: data.notes ?? null,
        createdById: session.user.id,
        status: "PROGRAMADA",
      },
    })
    revalidatePath("/meetings")
    revalidatePath("/")
    redirect("/meetings")
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e
    console.error("[createMeeting]", e)
    return { error: e instanceof Error ? e.message : String(e) }
  }
  return {}
}

export async function updateMeeting(id: string, data: {
  title?: string
  scheduledAt?: string
  status?: string
  notes?: string
}) {
  await requireSession()
  await prisma.meeting.update({
    where: { id },
    data: {
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  })
  revalidatePath("/meetings")
  revalidatePath("/")
}

export async function deleteMeeting(id: string) {
  await requireSession()
  await prisma.meeting.delete({ where: { id } })
  revalidatePath("/meetings")
  revalidatePath("/")
}
