import { AuthUser } from "@/lib/auth";
import { userModel } from "../user/user.model";
import { accountModel } from "./account.model";

type CreateAccountResult =
  | {
      success: true;
      account: unknown;
    }
  | {
      success: false;
      reason:
        | "USER_NOT_FOUND"
        | "USER_BANNED"
        | "KYC_NOT_APPROVED"
        | "ACCOUNT_ALREADY_EXISTS";
    };

export const createAccount = async (
  auth: AuthUser,
): Promise<CreateAccountResult> => {
  const user = await userModel.findById(auth.userId);

  if (!user) {
    return {
      success: false,
      reason: "USER_NOT_FOUND",
    };
  }

  if (user.isBanned) {
    return {
      success: false,
      reason: "USER_BANNED",
    };
  }

  if (user.kycVerification !== "APPROVED") {
    return {
      success: false,
      reason: "KYC_NOT_APPROVED",
    };
  }

  const existingAccount = await accountModel.findOne({
    user: user._id,
    status: "ACTIVE",
  });

  if (existingAccount) {
    return {
      success: false,
      reason: "ACCOUNT_ALREADY_EXISTS",
    };
  }

  const accountNumber = `${Date.now()}${Math.floor(Math.random() * 100000)}`;

  const account = await accountModel.create({
    user: user._id,
    accountNumber,
  });

  return {
    success: true,
    account,
  };
};
