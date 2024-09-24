import { NextRequest, NextResponse } from "next/server";
import { responseType } from "@/types/problemType";
import dbConnect from "@/db/dbConnect";
import Submission from "@/models/submissionModel";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // if (!token) {
    //   const errResponse: responseType = {
    //     status: 400,
    //     success: "false",
    //     message: "Login first to see the submissions",
    //   };
    //   return NextResponse.json(errResponse);
    // }
    console.log(token);
    const userId = "66f253706fdf7623ddfd2025";
    const { searchParams } = new URL(req.url);
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };
    console.log(queryParams);
    const page = Number(queryParams.page);
    const limit = Number(queryParams.limit);
    // console.log("start " + start + " end " + end);
    if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
      const errorResponse: responseType = {
        message: "Invalid query params",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    console.log(" Page " + page + "limit " + limit);
    const skip = (page - 1) * limit;
    const submissions = await Submission.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "problemId",
        select: "problemName _id",
      })
      .select("language status createdAt");

    const successResponse: responseType = {
      success: "true",
      status: 200,
      message: "submissions fetched successfully",
      messages: [submissions],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    const errResponse: responseType = {
      success: "false",
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
