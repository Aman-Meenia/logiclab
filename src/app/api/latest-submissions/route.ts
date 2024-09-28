import { NextRequest, NextResponse } from "next/server";
import { responseType } from "@/types/problemType";
import dbConnect from "@/db/dbConnect";
import Submission from "@/models/submissionModel";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // console.log(
    //   "<====================Latest Submissions Token===============>",
    // );
    if (!token || !token?._id) {
      const errResponse: responseType = {
        status: 400,
        success: "false",
        message: "Login first to see the submissions",
      };
      return NextResponse.json(errResponse);
    }
    const userId = token._id;
    const { searchParams } = new URL(req.url);
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };
    const page = Number(queryParams.page);
    const limit = Number(queryParams.limit);
    if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
      const errorResponse: responseType = {
        message: "Invalid query params",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

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

// get complete detail of the submissions

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.submissionId) {
      const errResponse: responseType = {
        success: "false",
        status: 400,
        message: "Submission Id is required",
      };
      return NextResponse.json(errResponse);
    }
    const isValid = mongoose.Types.ObjectId.isValid(data.submissionId);
    if (!isValid) {
      const errResponse: responseType = {
        success: "false",
        status: 400,
        message: "No submission found for this submission Id",
      };
      return NextResponse.json(errResponse);
    }
    const submissionDetail = await Submission.find({
      _id: data.submissionId,
    })
      .populate({
        path: "problemId",
        select: "problemName problemTitle",
      })
      .select({
        updatedAt: 0,
        __v: 0,
      });

    if (!submissionDetail) {
      const errResponse: responseType = {
        success: "false",
        status: 400,
        message: "No submission found for this submission Id",
      };
      return NextResponse.json(errResponse);
    }
    const successResponse: responseType = {
      success: "true",
      status: 200,
      message: "Submission details fetched successfully",
      messages: [submissionDetail],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    // console.log("err is " + err);
    // console.log(err);
    const errResponse: responseType = {
      success: "false",
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
