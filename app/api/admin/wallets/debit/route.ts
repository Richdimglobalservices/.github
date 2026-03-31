import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { user_id, amount, description } = await request.json();

    if (!user_id || !amount || !description) {
      return NextResponse.json(
        { error: "User ID, amount, and description are required" },
        { status: 400 }
      );
    }

    const debitAmount = parseFloat(amount);
    if (isNaN(debitAmount) || debitAmount <= 0) {
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
      return NextResponse.json(
        { error: "User wallet not found" },
        { status: 404 }
      );
    }

    const wallet = wallets[0];

    // Check sufficient balance
    if (Number(wallet.balance) < debitAmount) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      );
    }

    // Generate reference
    const reference = `DBT-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create transaction
    await sql`
      INSERT INTO transactions (user_id, wallet_id, type, amount, fee, net_amount, currency, status, reference, description, processed_by, processed_at)
      VALUES (${user_id}, ${wallet.id}, 'withdrawal', ${debitAmount}, 0, ${debitAmount}, 'USD', 'completed', ${reference}, ${description}, ${admin.id}, NOW())
    `;

    // Update wallet balance
    await sql`
      UPDATE wallets 
      SET balance = balance - ${debitAmount}, 
          total_withdrawn = total_withdrawn + ${debitAmount},
          updated_at = NOW()
      WHERE id = ${wallet.id}
    `;

    // Create notification
    await sql`
      INSERT INTO notifications (user_id, title, message, type, category)
      VALUES (
        ${user_id},
        'Wallet Debited',
        ${`$${debitAmount.toLocaleString()} has been deducted from your wallet. Reason: ${description}`},
        'warning',
        'wallet'
      )
    `;

    // Audit log
    await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address)
      VALUES (
        ${admin.id},
        'WALLET_DEBIT',
        'wallet',
        ${wallet.id},
        ${JSON.stringify({ user_id, amount: debitAmount, description, reference })},
        ${request.headers.get("x-forwarded-for") || null}
      )
    `;

    return NextResponse.json({
      message: "Wallet debited successfully",
      reference,
      amount: debitAmount,
    });
  } catch (error) {
    console.error("Wallet debit error:", error);
    return NextResponse.json(
      { error: "Failed to debit wallet" },
      { status: 500 }
    );
  }
}
