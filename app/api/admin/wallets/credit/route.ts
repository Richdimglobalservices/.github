import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { user_id, amount, description } = await request.json();

    if (!user_id || !amount) {
      return NextResponse.json(
        { error: "User ID and amount are required" },
        { status: 400 }
      );
    }

    const creditAmount = parseFloat(amount);
    if (isNaN(creditAmount) || creditAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get user's wallet
    const wallets = await sql`
      SELECT * FROM wallets WHERE user_id = ${user_id} AND currency = 'USD'
    `;

    if (wallets.length === 0) {
      // Create wallet if it doesn't exist
      await sql`
        INSERT INTO wallets (user_id, currency, balance, locked_balance, total_deposited, total_withdrawn)
        VALUES (${user_id}, 'USD', 0, 0, 0, 0)
      `;
    }

    const wallet = wallets[0];
    const walletId = wallet?.id || (await sql`SELECT id FROM wallets WHERE user_id = ${user_id} AND currency = 'USD'`)[0]?.id;

    // Generate reference
    const reference = `CRD-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create transaction
    await sql`
      INSERT INTO transactions (user_id, wallet_id, type, amount, fee, net_amount, currency, status, reference, description, processed_by, processed_at)
      VALUES (${user_id}, ${walletId}, 'deposit', ${creditAmount}, 0, ${creditAmount}, 'USD', 'completed', ${reference}, ${description || 'Manual credit by admin'}, ${admin.id}, NOW())
    `;

    // Update wallet balance
    await sql`
      UPDATE wallets 
      SET balance = balance + ${creditAmount}, 
          total_deposited = total_deposited + ${creditAmount},
          updated_at = NOW()
      WHERE id = ${walletId}
    `;

    // Create notification
    await sql`
      INSERT INTO notifications (user_id, title, message, type, category)
      VALUES (
        ${user_id},
        'Wallet Credited',
        ${`Your wallet has been credited with $${creditAmount.toLocaleString()}. ${description || ''}`},
        'success',
        'wallet'
      )
    `;

    // Audit log
    await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address)
      VALUES (
        ${admin.id},
        'WALLET_CREDIT',
        'wallet',
        ${walletId},
        ${JSON.stringify({ user_id, amount: creditAmount, description, reference })},
        ${request.headers.get("x-forwarded-for") || null}
      )
    `;

    return NextResponse.json({
      message: "Wallet credited successfully",
      reference,
      amount: creditAmount,
    });
  } catch (error) {
    console.error("Wallet credit error:", error);
    return NextResponse.json(
      { error: "Failed to credit wallet" },
      { status: 500 }
    );
  }
}
