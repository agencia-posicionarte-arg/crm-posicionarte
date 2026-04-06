import { cn } from "@/lib/utils"
import { CLIENT_STATUS_COLOR, type ClientStatus, SERVICE_LABEL, type ServiceType, MEETING_STATUS_COLOR, type MeetingStatus } from "@/lib/constants"

export function StatusBadge({ status }: { status: string }) {
  const color = CLIENT_STATUS_COLOR[status as ClientStatus] ?? "bg-surface-container-highest text-on-surface-variant"
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", color)}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

export function ServiceBadge({ service }: { service: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
      {SERVICE_LABEL[service as ServiceType] ?? service}
    </span>
  )
}

export function MeetingStatusBadge({ status }: { status: string }) {
  const color = MEETING_STATUS_COLOR[status as MeetingStatus] ?? "bg-surface-container-highest text-on-surface-variant"
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", color)}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
