import mongoose, { Schema, Types } from "mongoose";

export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REVERSED"
  | "PROCESSING";

export type TransactionType =
  | "TRANSFER"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "REFUND"
  | "FEE"
  | "INTEREST";

export interface ITransaction {
  fromAccount: Types.ObjectId;
  toAccount: Types.ObjectId;
  status: TransactionStatus;
  type: TransactionType;
  amount: number;
  idempotencyKey: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED", "PROCESSING"],
        message: "Status can only be PENDING, SUCCESS, FAILED, REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const transactionModel =
  mongoose.models.transaction ||
  mongoose.model<ITransaction>("transaction", transactionSchema);
