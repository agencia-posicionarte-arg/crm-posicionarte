import { auth } from "@/auth"

export default async function Topbar() {
  const session = await auth()
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??"

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 glass-panel flex justify-between items-center px-8">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-xl">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest rounded-full py-2.5 pl-12 pr-4 text-sm text-on-surface placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-container/30 transition-all"
            placeholder="Buscar clientes, reuniones..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-white/5 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold text-white tracking-tight">{session?.user?.name}</p>
            <p className="text-[10px] text-neutral-500 font-medium">Equipo Posicionarte</p>
          </div>
          <div className="w-9 h-9 rounded-full cta-gradient flex items-center justify-center font-black text-white text-sm ring-2 ring-primary/20">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
