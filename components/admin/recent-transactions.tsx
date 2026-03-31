import { sql } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Gift } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  deposit: <ArrowDownLeft className="h-4 w-4 text-green-600" />,
  withdrawal: <ArrowUpRight className="h-4 w-4 text-red-600" />,
  investment: <TrendingUp className="h-4 w-4 text-blue-600" />,
  return: <Gift className="h-4 w-4 text-purple-600" />,
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export async function AdminRecentTransactions() {
  const transactions = await sql`
    SELECT t.*, u.first_name, u.last_name, u.email
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
    LIMIT 5
  `;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx: Record<string, unknown>) => (
        <div key={tx.id as string} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {typeIcons[tx.type as string] || <ArrowUpRight className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {tx.first_name} {tx.last_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {tx.type as string} • {formatDate(tx.created_at as string)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {(tx.type === "deposit" || tx.type === "return") ? "+" : "-"}
              {formatCurrency(Number(tx.amount))}
            </p>
            <Badge variant="outline" className={statusColors[tx.status as string]}>
              {tx.status as string}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
