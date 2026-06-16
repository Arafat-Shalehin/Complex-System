import { AccountModel } from "./account.model";
import { userModel } from "../user/user.model";

export const createAccount = async (
  userId: string
) => {
  const user = await userModel.findById(
    userId
  );

  if (!user) {
    return {
      success: false,
      reason: "USER_NOT_FOUND",
    };
  }

  const existingAccount =
    await AccountModel.findOne({
      user: userId,
      status: "ACTIVE",
    });

  if (existingAccount) {
    return {
      success: false,
      reason: "ACCOUNT_ALREADY_EXISTS",
    };
  }

  const accountNumber =
    Date.now().toString();

  const account =
    await AccountModel.create({
      user: userId,
      accountNumber,
    });

  return {
    success: true,
    account,
  };
};