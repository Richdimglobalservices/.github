import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const searchTerm = `%${query}%`;
    
    const users = await sql`
      SELECT u.id, u.email, u.first_name, u.last_name, w.balance
      FROM users u
      LEFT JOIN wallets w ON w.user_id = u.id AND w.currency = 'USD'
      WHERE u.email ILIKE ${searchTerm} 
        OR u.first_name ILIKE ${searchTerm} 
        OR u.last_name ILIKE ${searchTerm}
      ORDER BY u.first_name, u.last_name
      LIMIT 10
    `;

    return NextResponse.json({ users });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
