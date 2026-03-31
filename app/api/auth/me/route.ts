import { NextResponse } from "next/server";
import { getCurrentUser, getUserPermissions } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const permissions = await getUserPermissions(user.id);

    return NextResponse.json({
      user,
      permissions,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
