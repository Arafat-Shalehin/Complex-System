import mongoose, { Schema, Types } from "mongoose";

export type AccountStatus =
  | "ACTIVE"
  | "FROZEN"
  | "CLOSED";

export type Currency =
  | "BDT"
  | "USD"
  | "EUR";

export interface IAccount {
  user: Types.ObjectId;
  accountNumber: string;
  status: AccountStatus;
  currency: Currency;
  createdAt?: Date;
  updatedAt?: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must belong to a user."],
      index: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message:
          "Status can only be ACTIVE, FROZEN or CLOSED.",
      },
      default: "ACTIVE",
      required: true,
    },

    currency: {
      type: String,
      enum: {
        values: ["BDT", "USD", "EUR"],
        message:
          "Currency must be BDT, USD or EUR.",
      },
      default: "BDT",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({
  user: 1,
  status: 1,
});

export const accountModel =
  mongoose.models.account ||
  mongoose.model<IAccount>(
    "account",
    accountSchema
  );