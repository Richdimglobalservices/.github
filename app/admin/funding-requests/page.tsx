import { sql } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/i18n";
import { Eye, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function AdminFundingRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 15;
  const offset = (page - 1) * perPage;

  let whereClause = "";
  const conditions: string[] = [];
  
  if (params.status) {
    conditions.push(`fr.status = '${params.status}'`);
  }
  if (params.type) {
    conditions.push(`fr.type = '${params.type}'`);
  }
  
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(" AND ")}`;
  }

  const requests = await sql`
    SELECT fr.*, u.first_name, u.last_name, u.email, fm.name as method_name
    FROM funding_requests fr
    LEFT JOIN users u ON fr.user_id = u.id
    LEFT JOIN funding_methods fm ON fr.method_id = fm.id
    ORDER BY 
      CASE WHEN fr.status = 'pending' THEN 0 ELSE 1 END,
      fr.created_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `;

  const countResult = await sql`SELECT COUNT(*) as total FROM funding_requests`;
  const total = Number(countResult[0]?.total || 0);
  const totalPages = Math.ceil(total / perPage);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Funding Requests</h1>
          <p className="text-muted-foreground">
            Review and process deposit/withdrawal requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/funding-requests">
              <Button variant={!params.status && !params.type ? "default" : "outline"} size="sm">All</Button>
            </Link>
            <Link href="/admin/funding-requests?status=pending">
              <Button variant={params.status === "pending" ? "default" : "outline"} size="sm">Pending</Button>
            </Link>
            <Link href="/admin/funding-requests?status=approved">
              <Button variant={params.status === "approved" ? "default" : "outline"} size="sm">Approved</Button>
            </Link>
            <Link href="/admin/funding-requests?type=deposit">
              <Button variant={params.type === "deposit" ? "default" : "outline"} size="sm">Deposits</Button>
            </Link>
            <Link href="/admin/funding-requests?type=withdrawal">
              <Button variant={params.type === "withdrawal" ? "default" : "outline"} size="sm">Withdrawals</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: Record<string, unknown>) => (
                  <tr key={req.id as string} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {(req.first_name as string)?.[0] || "?"}{(req.last_name as string)?.[0] || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{req.first_name} {req.last_name}</p>
                          <p className="text-sm text-muted-foreground">{req.email as string}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {req.type === "deposit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className="capitalize">{req.type as string}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.method_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(Number(req.amount))}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={statusColors[req.status as string]}>
                        {req.status as string}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(req.created_at as string)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/funding-requests/${req.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No funding requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {offset + 1} to {Math.min(offset + perPage, total)} of {total} requests
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/funding-requests?page=${page - 1}${params.status ? `&status=${params.status}` : ""}${params.type ? `&type=${params.type}` : ""}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/admin/funding-requests?page=${page + 1}${params.status ? `&status=${params.status}` : ""}${params.type ? `&type=${params.type}` : ""}`}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
