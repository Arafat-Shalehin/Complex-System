import { NextRequest } from "next/server";
import {
  sendTransactionEmail,
  sendTransactionFailureEmail,
} from "../email/email.service";
import { ledgerModel } from "../ledger/ledger.model";
import { transactionModel } from "./transaction.model";

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
