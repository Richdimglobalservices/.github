import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/i18n";
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  Clock,
} from "lucide-react";
import { ClientPortfolioChart } from "@/components/client/portfolio-chart";

async function getClientStats(userId: string) {
  const [wallet, investments, pendingDeposits, pendingWithdrawals, recentTransactions] = await Promise.all([
    sql`SELECT * FROM wallets WHERE user_id = ${userId} AND currency = 'USD'`,
    sql`
      SELECT i.*, ip.name as plan_name, ip.roi_percentage
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = ${userId} AND i.status = 'active'
      ORDER BY i.created_at DESC
    `,
    sql`SELECT COALESCE(SUM(amount), 0) as total FROM funding_requests WHERE user_id = ${userId} AND type = 'deposit' AND status = 'pending'`,
    sql`SELECT COALESCE(SUM(amount), 0) as total FROM funding_requests WHERE user_id = ${userId} AND type = 'withdrawal' AND status = 'pending'`,
    sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 5
    `,
  ]);

  const walletData = wallet[0];
  const totalInvested = investments.reduce((sum: number, inv: { amount: number }) => sum + Number(inv.amount), 0);
  const totalExpectedReturn = investments.reduce((sum: number, inv: { expected_return: number }) => sum + Number(inv.expected_return), 0);
  const totalActualReturn = investments.reduce((sum: number, inv: { actual_return: number }) => sum + Number(inv.actual_return), 0);

  return {
    balance: Number(walletData?.balance || 0),
    lockedBalance: Number(walletData?.locked_balance || 0),
    totalDeposited: Number(walletData?.total_deposited || 0),
    totalWithdrawn: Number(walletData?.total_withdrawn || 0),
    totalInvested,
    totalExpectedReturn,
    totalActualReturn,
    activeInvestments: investments.length,
    investments,
    pendingDeposits: Number(pendingDeposits[0]?.total || 0),
    pendingWithdrawals: Number(pendingWithdrawals[0]?.total || 0),
    recentTransactions,
  };
}

export default async function ClientDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const stats = await getClientStats(user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Welcome back, {user.first_name}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/wallet/deposit">
            <Button variant="outline">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </Link>
          <Link href="/app/investments/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Invest
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Balance
            </CardTitle>
            <Wallet className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            {stats.lockedBalance > 0 && (
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(stats.lockedBalance)} locked
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invested
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeInvestments} active investment{stats.activeInvestments !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected Returns
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(stats.totalExpectedReturn)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalActualReturn)} earned so far
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.pendingDeposits + stats.pendingWithdrawals)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingDeposits > 0 && `${formatCurrency(stats.pendingDeposits)} deposits`}
              {stats.pendingDeposits > 0 && stats.pendingWithdrawals > 0 && " | "}
              {stats.pendingWithdrawals > 0 && `${formatCurrency(stats.pendingWithdrawals)} withdrawals`}
              {stats.pendingDeposits === 0 && stats.pendingWithdrawals === 0 && "No pending requests"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Active Investments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your investment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientPortfolioChart investments={stats.investments} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Investments</CardTitle>
              <CardDescription>Your current investment positions</CardDescription>
            </div>
            <Link href="/app/investments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.investments.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No active investments yet</p>
                <Link href="/app/investments/new">
                  <Button>Start Investing</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.investments.slice(0, 3).map((inv: Record<string, unknown>) => (
                  <div key={inv.id as string} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{inv.plan_name as string}</p>
                      <p className="text-sm text-muted-foreground">
                        Matures {formatDate(inv.maturity_date as string)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(Number(inv.amount))}</p>
                      <p className="text-sm text-green-600">+{inv.roi_percentage}% ROI</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </div>
          <Link href="/app/transactions">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentTransactions.map((tx: Record<string, unknown>) => (
                <div key={tx.id as string} className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    tx.type === "deposit" || tx.type === "return" 
                      ? "bg-green-100" 
                      : "bg-red-100"
                  }`}>
                    {tx.type === "deposit" || tx.type === "return" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{tx.type as string}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.created_at as string)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      tx.type === "deposit" || tx.type === "return" 
                        ? "text-green-600" 
                        : ""
                    }`}>
                      {tx.type === "deposit" || tx.type === "return" ? "+" : "-"}
                      {formatCurrency(Number(tx.amount))}
                    </p>
                    <Badge variant="outline" className={
                      tx.status === "completed" ? "bg-green-100 text-green-800" :
                      tx.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {tx.status as string}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
