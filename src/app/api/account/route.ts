import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { createAccount } from "@/modules/account/account.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth(request);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          message: "UNAUTHORIZED_USER",
        },
        {
          status: 401,
        },
      );
    }

    const result = await createAccount(auth);

    if (!result.success) {
      switch (result.reason) {
        case "USER_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              message: "User not found.",
            },
            {
              status: 404,
            },
          );

        case "ACCOUNT_ALREADY_EXISTS":
          return NextResponse.json(
            {
              success: false,
              message: "Account already exists.",
            },
            {
              status: 409,
            },
          );

        case "USER_BANNED":
          return NextResponse.json(
            {
              success: false,
              message: "User is banned and cannot perform this action.",
            },
            {
              status: 403,
            },
          );

        case "KYC_NOT_APPROVED":
          return NextResponse.json(
            {
              success: false,
              message: "KYC verification is required before creating an account.",
            },
            {
              status: 403,
            },
          );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        account: result.account,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
