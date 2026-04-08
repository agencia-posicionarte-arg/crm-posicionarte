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
  SITIO_WEB: "SITIO_WEB",
  SOCIAL_MEDIA: "SOCIAL_MEDIA",
  GOOGLE_ADS: "GOOGLE_ADS",
  META_ADS: "META_ADS",
  AUTOMATIZACIONES: "AUTOMATIZACIONES",
} as const

export type ServiceType = keyof typeof SERVICE

export const SERVICE_LABEL: Record<ServiceType, string> = {
  SITIO_WEB: "Sitio Web (SEO-AEO)",
  SOCIAL_MEDIA: "Social Media",
  GOOGLE_ADS: "Google Ads",
  META_ADS: "Meta Ads",
  AUTOMATIZACIONES: "Automatizaciones",
}

export const BILLING_TYPE = {
  MONTHLY: "MONTHLY",
  COMMISSION: "COMMISSION",
  ONE_TIME: "ONE_TIME",
} as const

export type BillingType = keyof typeof BILLING_TYPE

export const BILLING_TYPE_LABEL: Record<BillingType, string> = {
  MONTHLY: "Abono mensual (USD)",
  COMMISSION: "Comisión (% a mes vencido)",
  ONE_TIME: "Pago único",
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
