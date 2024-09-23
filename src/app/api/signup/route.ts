import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import dbConnect from "@/db/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/UserModel";

const signupDataValidationType = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(
        /^[a-z0-9@]+$/,
        "Username must only contain lowercase letters, numbers, and @",
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must be at most 32 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .strict();

type signupDataValidation = z.infer<typeof signupDataValidationType>;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data: signupDataValidation = await req.json();

    const zodValidation = signupDataValidationType.safeParse(data);

    if (!zodValidation.success) {
      const errorResponse: responseType = {
        message: fromZodError(zodValidation.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    if (data.password !== data.confirmPassword) {
      const errResponse: responseType = {
        success: "false",
        status: 400,
        message: "Password and confirm password does not match",
      };
      return NextResponse.json(errResponse);
    }

    // check if email is already used

    const emailFind = await User.findOne({
      email: data.email,
    });

    console.log(emailFind);
    if (
      (emailFind && emailFind.isVerified) ||
      (emailFind && emailFind.otpExpiry.getTime() < Date.now())
    ) {
      const errorResponse: responseType = {
        message: "Account is already registered with this email",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    // Username check
    const usernameFind = await User.findOne({
      username: data.username,
    });
    if (
      (usernameFind && usernameFind.isVerified) ||
      (usernameFind && usernameFind.otpExpiry.getTime() < Date.now())
    ) {
      const errorResponse: responseType = {
        message: "Username already in used",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = generateOTP();
    const otpExpiryTime = generateOTPExpiryTime();

    const user = new User({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      otp: otp,
      otpExpiry: otpExpiryTime,
    });

    await user.save();
    const successResponse: responseType = {
      success: "true",
      message: "User created successfully",
      status: 200,
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error",
      success: "false",
      status: 500,
    };
    return NextResponse.json(errorResponse);
  }
}

// Generate OTP Function

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Generate OTP Expiry Time

const generateOTPExpiryTime = () => {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return expiryTime;
};
