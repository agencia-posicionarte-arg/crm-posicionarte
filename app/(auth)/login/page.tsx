"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError("Email o contraseña incorrectos. Verificá que tu cuenta esté habilitada.")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 rounded-xl cta-gradient flex items-center justify-center shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              architecture
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-white">Posicionarte</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">CRM Architect</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-container-low rounded-2xl p-8">
          <h2 className="text-xl font-bold tracking-tighter text-white mb-2">Iniciar sesión</h2>
          <p className="text-sm text-neutral-500 mb-8">Acceso exclusivo para el equipo Posicionarte.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-surface-container border-0 border-b border-outline-variant/30 rounded-t-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-b-primary transition-colors"
                placeholder="tu@posicionarte.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-surface-container border-0 border-b border-outline-variant/30 rounded-t-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-b-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-error bg-error-container/20 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cta-gradient text-white py-3 px-4 rounded-xl font-bold text-sm tracking-tight hover:opacity-90 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Verificando..." : "Entrar al CRM"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
