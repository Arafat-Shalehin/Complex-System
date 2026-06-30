import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { userModel, KycStatus, UserRole } from "@/modules/user/user.model";

export interface AuthUser {
  userId: string;
  role: UserRole;
  isBanned: boolean;
  kycVerification: KycStatus;
}

export async function requireAuth(
  request: NextRequest,
): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return null;
    }

    const payload = verifyToken(token.value);

    const user = await userModel.findById(payload.userId);

    if (!user) {
      return null;
    }

    return {
      userId: user._id.toString(),
      role: user.role,
      isBanned: user.isBanned,
      kycVerification: user.kycVerification,
    };
  } catch {
    return null;
  }
}

export async function requireSystemUser(
  request: NextRequest,
): Promise<boolean> {
  try {
    const token = request.cookies.get("token");

    if (!token) {
      return false;
    }

    const payload = verifyToken(token.value);

    const user = await userModel
      .findById(payload.userId)
      .select("+systemUser");

    if (!user) {
      return false;
    }

    if (!user.systemUser) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("System authentication failed:", error);
    return false;
  }
}
