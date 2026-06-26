import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { userModel } from "@/modules/user/user.model";
import { sendRegistrationEmail } from "@/modules/email/email.service";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        {
          status: 409,
        },
      );
    }

    // console.log(name, email, password);

    const user = await userModel.create({
      name,
      email,
      password,
      role: "USER",
    });

    const token = generateToken(user._id.toString());

    void sendRegistrationEmail(user.email, user.name);

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
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
