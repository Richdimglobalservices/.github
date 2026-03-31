import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { first_name, last_name, email, phone, password } = await request.json();

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Get client role
    const roles = await sql`SELECT id FROM roles WHERE name = 'client'`;
    const clientRoleId = roles[0]?.id;

    if (!clientRoleId) {
      return NextResponse.json(
        { error: "System configuration error" },
        { status: 500 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUsers = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, status, email_verified)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${first_name}, ${last_name}, ${phone || null}, ${clientRoleId}, 'active', false)
      RETURNING id, email, first_name, last_name, phone, role_id, status, email_verified, kyc_status, language, created_at
    `;

    const newUser = newUsers[0];

    // Create wallet for user
    await sql`
      INSERT INTO wallets (user_id, currency, balance, locked_balance, total_deposited, total_withdrawn)
      VALUES (${newUser.id}, 'USD', 0, 0, 0, 0)
    `;

    // Generate referral code
    const referralCode = `BIC${newUser.id.slice(0, 8).toUpperCase()}`;
    await sql`
      INSERT INTO referral_codes (user_id, code, commission_rate, is_active)
      VALUES (${newUser.id}, ${referralCode}, 5.00, true)
    `;

    // Create session
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");
    
    await createSession(newUser.id, ipAddress || undefined, userAgent || undefined);

    // Create welcome notification
    await sql`
      INSERT INTO notifications (user_id, title, message, type, category)
      VALUES (
        ${newUser.id},
        'Welcome to BICFLOW CAPITAL',
        'Your account has been created successfully. Complete your KYC verification to unlock all features.',
        'success',
        'account'
      )
    `;

    return NextResponse.json({
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
