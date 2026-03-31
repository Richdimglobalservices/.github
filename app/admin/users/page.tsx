import { sql } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatDate } from "@/lib/i18n";
import { Eye, UserPlus, Search } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  let query = sql`
    SELECT u.*, r.name as role_name, w.balance
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
  `;

  if (params.status) {
    query = sql`
      SELECT u.*, r.name as role_name, w.balance
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
      WHERE u.status = ${params.status}
    `;
  }

  if (params.search) {
    const searchTerm = `%${params.search}%`;
    query = sql`
      SELECT u.*, r.name as role_name, w.balance
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
      WHERE u.email ILIKE ${searchTerm} OR u.first_name ILIKE ${searchTerm} OR u.last_name ILIKE ${searchTerm}
    `;
  }

  const users = await sql`
    SELECT u.*, r.name as role_name, w.balance
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
    ORDER BY u.created_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `;

  const countResult = await sql`SELECT COUNT(*) as total FROM users`;
  const total = Number(countResult[0]?.total || 0);
  const totalPages = Math.ceil(total / perPage);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const kycColors: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    submitted: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users and their accounts
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <form>
                <Input
                  name="search"
                  placeholder="Search users..."
                  defaultValue={params.search}
                  className="pl-9"
                />
              </form>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/users">
                <Button variant={!params.status ? "default" : "outline"} size="sm">All</Button>
              </Link>
              <Link href="/admin/users?status=active">
                <Button variant={params.status === "active" ? "default" : "outline"} size="sm">Active</Button>
              </Link>
              <Link href="/admin/users?status=pending">
                <Button variant={params.status === "pending" ? "default" : "outline"} size="sm">Pending</Button>
              </Link>
              <Link href="/admin/users?status=suspended">
                <Button variant={params.status === "suspended" ? "default" : "outline"} size="sm">Suspended</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">KYC</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: Record<string, unknown>) => (
                  <tr key={user.id as string} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {(user.first_name as string)[0]}{(user.last_name as string)[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email as string}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize">{(user.role_name as string)?.replace("_", " ") || "N/A"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={statusColors[user.status as string]}>
                        {user.status as string}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={kycColors[user.kyc_status as string]}>
                        {user.kyc_status as string}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      ${Number(user.balance || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(user.created_at as string)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No users found
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
                Showing {offset + 1} to {Math.min(offset + perPage, total)} of {total} users
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/users?page=${page - 1}${params.status ? `&status=${params.status}` : ""}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/admin/users?page=${page + 1}${params.status ? `&status=${params.status}` : ""}`}>
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
