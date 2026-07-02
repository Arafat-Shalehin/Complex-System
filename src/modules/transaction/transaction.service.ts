import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {
  sendTransactionEmail,
  sendTransactionFailureEmail,
} from "../email/email.service";
import { ledgerModel } from "../ledger/ledger.model";
import { ITransaction, transactionModel } from "./transaction.model";
import { accountModel } from "../account/account.model";
import { userModel } from "../user/user.model";

/**
 * * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate Request
 * 2. Validate Idempotency Key
 * 3. Check Account Status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB Session
 * 10. Send email notification
 */

type CreateInitialFundsResult =
  | {
      success: true;
      transaction: ITransaction;
    }
  | {
      success: false;
      reason:
        | "INVALID_AMOUNT"
        | "RECIPIENT_ACCOUNT_NOT_FOUND"
        | "SYSTEM_ACCOUNT_NOT_FOUND"
        | "IDEMPOTENCY_KEY_ALREADY_EXISTS";
    };

interface CreateInitialFundsInput {
  systemUserId: string;
  toAccountId: string;
  amount: number;
  idempotencyKey: string;
}

export const createInitialFunds = async (
  input: CreateInitialFundsInput,
): Promise<CreateInitialFundsResult> => {};
