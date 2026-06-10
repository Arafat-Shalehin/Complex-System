import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  accountStatus: boolean;
  kycVerification: boolean;
  isBanned: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModelType = IUser & IUserMethods;

const userSchema = new Schema<UserModelType>(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating a user."],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address.",
      ],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Name is required for creating a user."],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required for creating an account."],
      minlength: [8, "Password should contain at least 8 characters."],
      select: false,
    },

    role: {
      type: String,
      default: "user",
    },

    accountStatus: {
      type: Boolean,
      default: true,
    },

    kycVerification: {
      type: Boolean,
      default: false,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const userModel =
  mongoose.models.User ||
  mongoose.model<UserModelType>("User", userSchema);