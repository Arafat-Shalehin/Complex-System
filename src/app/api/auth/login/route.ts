import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { userModel } from "@/modules/user/user.model";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        {
          status: 401,
        },
      );
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        {
          status: 401,
        },
      );
    }

    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3,
      path: "/",
    });

    return response;

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
