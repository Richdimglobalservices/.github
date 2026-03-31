import { sql } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Eye } from "lucide-react";

export async function AdminPendingRequests() {
  const requests = await sql`
    SELECT fr.*, u.first_name, u.last_name, u.email, fm.name as method_name
    FROM funding_requests fr
    LEFT JOIN users u ON fr.user_id = u.id
    LEFT JOIN funding_methods fm ON fr.method_id = fm.id
    WHERE fr.status = 'pending'
    ORDER BY fr.created_at ASC
    LIMIT 5
  `;

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No pending requests
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req: Record<string, unknown>) => (
        <div key={req.id as string} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {req.type === "deposit" ? (
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {req.first_name} {req.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {req.method_name || "Unknown method"} • {formatDate(req.created_at as string)}
            </p>
          </div>
          <div className="text-right flex items-center gap-2">
            <div>
              <p className="text-sm font-medium">
                {formatCurrency(Number(req.amount))}
              </p>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                {req.type as string}
              </Badge>
            </div>
            <Link href={`/admin/funding-requests/${req.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
      {requests.length >= 5 && (
        <Link href="/admin/funding-requests?status=pending" className="block">
          <Button variant="outline" className="w-full">
            View All Pending
          </Button>
        </Link>
      )}
    </div>
  );
}
