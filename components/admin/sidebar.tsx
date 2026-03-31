"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";
import {
  LayoutDashboard,
  Users,
  Wallet,
  TrendingUp,
  ArrowUpDown,
  Settings,
  FileText,
  BarChart3,
  HelpCircle,
  Shield,
  Building2,
  Bell,
  Gavel,
} from "lucide-react";

interface AdminSidebarProps {
  user: User;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/wallets", label: "Wallets", icon: Wallet },
  { href: "/admin/investments", label: "Investments", icon: TrendingUp },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowUpDown },
  { href: "/admin/funding-requests", label: "Funding Requests", icon: Building2 },
  { href: "/admin/plans", label: "Investment Plans", icon: BarChart3 },
  { href: "/admin/support", label: "Support Tickets", icon: HelpCircle },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/legal", label: "Legal Documents", icon: Gavel },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/roles", label: "Roles & Permissions", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-serif font-bold text-sm">B</span>
        </div>
        <div>
          <span className="font-serif font-bold text-lg">BICFLOW</span>
          <span className="ml-1 text-xs text-muted-foreground">Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.first_name[0]}{user.last_name[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role_name?.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
