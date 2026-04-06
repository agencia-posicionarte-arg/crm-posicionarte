import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen custom-scrollbar">
        {children}
      </main>
    </div>
  )
}
