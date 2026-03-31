import { sql } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Wallet,
  TrendingUp,
  ArrowUpDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AdminRecentTransactions } from "@/components/admin/recent-transactions";
import { AdminPendingRequests } from "@/components/admin/pending-requests";

async function getStats() {
  const [users, wallets, investments, transactions, pendingFunding] = await Promise.all([
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active') as active FROM users`,
    sql`SELECT COALESCE(SUM(balance), 0) as total_balance FROM wallets`,
    sql`SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as total_amount, COUNT(*) FILTER (WHERE status = 'active') as active FROM investments`,
    sql`SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as total_volume FROM transactions WHERE status = 'completed'`,
    sql`SELECT COUNT(*) as pending FROM funding_requests WHERE status = 'pending'`,
  ]);

  return {
    totalUsers: Number(users[0]?.total || 0),
    activeUsers: Number(users[0]?.active || 0),
    totalBalance: Number(wallets[0]?.total_balance || 0),
    totalInvested: Number(investments[0]?.total_amount || 0),
    activeInvestments: Number(investments[0]?.active || 0),
    totalTransactions: Number(transactions[0]?.total || 0),
    transactionVolume: Number(transactions[0]?.total_volume || 0),
    pendingRequests: Number(pendingFunding[0]?.pending || 0),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      description: `${stats.activeUsers} active`,
      icon: Users,
      color: "text-blue-600",
      href: "/admin/users",
    },
    {
      title: "Total Balance",
      value: `$${stats.totalBalance.toLocaleString()}`,
      description: "Across all wallets",
      icon: Wallet,
      color: "text-green-600",
      href: "/admin/wallets",
    },
    {
      title: "Active Investments",
      value: stats.activeInvestments.toLocaleString(),
      description: `$${stats.totalInvested.toLocaleString()} invested`,
      icon: TrendingUp,
      color: "text-purple-600",
      href: "/admin/investments",
    },
    {
      title: "Transaction Volume",
      value: `$${stats.transactionVolume.toLocaleString()}`,
      description: `${stats.totalTransactions} transactions`,
      icon: ArrowUpDown,
      color: "text-orange-600",
      href: "/admin/transactions",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your BICFLOW CAPITAL platform
          </p>
        </div>
        {stats.pendingRequests > 0 && (
          <Link href="/admin/funding-requests">
            <Button variant="outline" className="gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              {stats.pendingRequests} Pending Requests
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/admin/wallets/credit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Credit Wallet</p>
                <p className="text-xs text-muted-foreground">Add funds to user</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/wallets/debit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Debit Wallet</p>
                <p className="text-xs text-muted-foreground">Remove funds</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/funding-requests?status=pending">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Pending Requests</p>
                <p className="text-xs text-muted-foreground">{stats.pendingRequests} awaiting</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users?status=pending">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">KYC Approvals</p>
                <p className="text-xs text-muted-foreground">Review submissions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentTransactions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Funding Requests</CardTitle>
            <CardDescription>Awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminPendingRequests />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
