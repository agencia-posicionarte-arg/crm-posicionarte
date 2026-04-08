function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

type Props = {
  billingType: string
  payments: { month: string }[]
}

export default function PaymentStatusBadge({ billingType, payments }: Props) {
  if (billingType === "ONE_TIME") return null

  const month = currentMonth()
  const paid = payments.some((p) => p.month === month)

  return paid ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
      Al día
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-error inline-block" />
      Debe pagar
    </span>
  )
}
