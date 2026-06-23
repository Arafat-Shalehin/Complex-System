import { NextRequest } from "next/server";
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
