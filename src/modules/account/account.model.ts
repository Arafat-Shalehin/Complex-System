import mongoose, { ObjectId, Schema } from "mongoose";

export interface IAccount {
  user: ObjectId;
  status: string;
  currency: string;
}

const accountSchema = new Schema<IAccount>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must be associated with a user"],
      index: true,
    },
    status: {
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can be either ACTIVE, FROZEN or CLOSED",
      },
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      default: "BDT",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 });

export const accountModel =
  mongoose.models.account || mongoose.model<IAccount>("account", accountSchema);
