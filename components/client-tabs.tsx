"use client"

import { useState } from "react"

type Tab = { id: string; label: string }

export default function ClientTabs({ tabs, children }: { tabs: Tab[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(tabs[0].id)

  return (
    <div>
      <div className="flex gap-1 mb-8 border-b border-white/5 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-3 text-sm font-bold tracking-tight transition-all border-b-2 -mb-px ${
              active === tab.id
                ? "border-primary-container text-white"
                : "border-transparent text-neutral-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div key={tab.id} className={active === tab.id ? "block" : "hidden"}>
          {children[i]}
        </div>
      ))}
    </div>
  )
}
