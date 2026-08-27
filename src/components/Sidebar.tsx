"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
    ...(userRole === 'ADMIN' ? [{ name: "Settings", href: "/dashboard/settings", icon: Settings }] : []),
  ]

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Expensify</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2 w-full text-left text-muted-foreground hover:bg-gray-100 rounded-md"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
