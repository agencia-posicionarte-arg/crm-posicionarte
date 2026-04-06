export const CLIENT_STATUS = {
  PROSPECTO: "PROSPECTO",
  ACTIVO: "ACTIVO",
  PAUSADO: "PAUSADO",
  PERDIDO: "PERDIDO",
} as const

export type ClientStatus = keyof typeof CLIENT_STATUS

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  PROSPECTO: "Prospecto",
  ACTIVO: "Activo",
  PAUSADO: "Pausado",
  PERDIDO: "Perdido",
}

export const CLIENT_STATUS_COLOR: Record<ClientStatus, string> = {
  PROSPECTO: "bg-primary/10 text-primary",
  ACTIVO: "bg-secondary/10 text-secondary",
  PAUSADO: "bg-surface-container-highest text-on-surface-variant",
  PERDIDO: "bg-error/10 text-error",
}

export const SERVICE = {
  SEO: "SEO",
  PAID_MEDIA: "PAID_MEDIA",
  SOCIAL_STRATEGY: "SOCIAL_STRATEGY",
  OTRO: "OTRO",
} as const

export type ServiceType = keyof typeof SERVICE

export const SERVICE_LABEL: Record<ServiceType, string> = {
  SEO: "SEO",
  PAID_MEDIA: "Paid Media",
  SOCIAL_STRATEGY: "Social Strategy",
  OTRO: "Otro",
}

export const BILLING_TYPE = {
  PREPAID: "PREPAID",
  POSTPAID: "POSTPAID",
} as const

export type BillingType = keyof typeof BILLING_TYPE

export const BILLING_TYPE_LABEL: Record<BillingType, string> = {
  PREPAID: "Pago por adelantado",
  POSTPAID: "Pago a mes vencido",
}

export const MEETING_STATUS = {
  PROGRAMADA: "PROGRAMADA",
  REALIZADA: "REALIZADA",
  CANCELADA: "CANCELADA",
} as const

export type MeetingStatus = keyof typeof MEETING_STATUS

export const MEETING_STATUS_LABEL: Record<MeetingStatus, string> = {
  PROGRAMADA: "Programada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
}

export const MEETING_STATUS_COLOR: Record<MeetingStatus, string> = {
  PROGRAMADA: "bg-primary/10 text-primary",
  REALIZADA: "bg-secondary/10 text-secondary",
  CANCELADA: "bg-surface-container-highest text-on-surface-variant",
}
