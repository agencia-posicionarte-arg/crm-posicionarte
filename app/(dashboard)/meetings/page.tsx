import { prisma } from "@/lib/db"
import Link from "next/link"
import MeetingsClient from "@/components/meetings-client"

export default async function MeetingsPage() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { client: true, createdBy: true },
  })

  return (
    <div>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-2">Reuniones</h2>
          <p className="text-neutral-500 font-medium">{meetings.length} reuniones registradas.</p>
        </div>
        <Link href="/meetings/new" className="cta-gradient text-white py-2.5 px-5 rounded-xl font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add_circle</span>
          Nueva Reunión
        </Link>
      </div>
      <MeetingsClient meetings={meetings} />
    </div>
  )
}
