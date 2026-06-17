import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createAccount } from "@/modules/account/account.service";

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const { userId } =
      await request.json();

    const result =
      await createAccount(userId);

    if (!result.success) {
      switch (result.reason) {
        case "USER_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              message:
                "User not found.",
            },
            {
              status: 404,
            }
          );

        case "ACCOUNT_ALREADY_EXISTS":
          return NextResponse.json(
            {
              success: false,
              message:
                "Account already exists.",
            },
            {
              status: 409,
            }
          );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",
        account: result.account,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}