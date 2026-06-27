import mongoose, { Schema, Types } from "mongoose";

export type LedgerType = "DEBIT" | "CREDIT";

export interface ILedger {
  account: Types.ObjectId;
  amount: number;
  transaction: Types.ObjectId;
  type: LedgerType;
}

const ledgerSchema = new Schema<ILedger>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: true,
      immutable: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "transaction",
      required: true,
      immutable: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Type can be either CREDIT or DEBIT",
      },
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

function preventLedgerModification(next: any) {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted.",
  );
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);

export const ledgerModel =
  mongoose.models.ledger || mongoose.model<ILedger>("ledger", ledgerSchema);
