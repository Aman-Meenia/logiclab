import { NextRequest, NextResponse } from "next/server";
import { responseType } from "@/types/problemType";
import dbConnect from "@/db/dbConnect";
import Submission from "@/models/submissionModel";
import Problem from "@/models/problemModel";
import mongoose from "mongoose";
import User from "@/models/UserModel";
import { getToken } from "next-auth/jwt";

type submissionType = {
  _id: string;
  problemId: {
    _id: string;
    problemName: string;
  };
  createdAt: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token?._id) {
      const errResponse: responseType = {
        status: 400,
        success: "false",
        message: "Login first to see the submissions",
      };
      return NextResponse.json(errResponse);
    }
    const userId = token._id;

    const user = await User.findById(userId);
    if (!user) {
      const errorResponse: responseType = {
        message: "User not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const problemCount = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty", // Group by difficulty field
          count: { $sum: 1 }, // Sum the number of problems in each group
        },
      },
    ]);

    const noOfProblemSolverCount = await Submission.aggregate([
      // Match submissions for the given user with "Accepted" status
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: "$problemId",
        },
      },
      {
        $lookup: {
          from: "problems",
          localField: "_id",
          foreignField: "_id",
          as: "problem",
        },
      },
      // Unwind the problem array
      {
        $unwind: "$problem",
      },
      // Group by difficulty and count
      {
        $group: {
          _id: "$problem.difficulty",
          count: { $sum: 1 },
        },
      },
      // Reshape the output
      {
        $project: {
          difficulty: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    type profileResposneType = {
      username: string;
      profilePic: string;
      totalSolvedCount: number;
      totalProblemCount: number;
      easyProblemCount: number;
      easySolvedCount: number;
      mediumProblemCount: number;
      mediumSolvedCount: number;
      hardProblemCount: number;
      hardSolvedCount: number;
      submissions: submissionType[];
    };

    const profileResponse: profileResposneType = {
      username: user.username,
      profilePic: user?.profilePic || "",
      totalProblemCount: 0,
      easyProblemCount: 0,
      mediumProblemCount: 0,
      hardProblemCount: 0,
      totalSolvedCount: 0,
      easySolvedCount: 0,
      mediumSolvedCount: 0,
      hardSolvedCount: 0,
      submissions: [],
    };

    problemCount.map((problem) => {
      if (problem._id === "easy") {
        profileResponse.easyProblemCount = problem.count;
        profileResponse.totalProblemCount += problem.count;
      } else if (problem._id === "medium") {
        profileResponse.mediumProblemCount = problem.count;
        profileResponse.totalProblemCount += problem.count;
      } else if (problem._id === "hard") {
        profileResponse.hardProblemCount = problem.count;
        profileResponse.totalProblemCount += problem.count;
      }
    });

    noOfProblemSolverCount.map((problem) => {
      if (problem.difficulty === "easy") {
        profileResponse.easySolvedCount = problem.count;
        profileResponse.totalSolvedCount += problem.count;
      } else if (problem.difficulty === "medium") {
        profileResponse.mediumSolvedCount = problem.count;
        profileResponse.totalSolvedCount += problem.count;
      } else if (problem.difficulty === "hard") {
        profileResponse.hardSolvedCount = problem.count;
        profileResponse.totalSolvedCount += problem.count;
      }
    });

    const skip = 0;
    const limit = 10;
    const submissions: submissionType[] = await Submission.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "problemId",
        select: "problemName _id",
      })
      .select("createdAt");

    profileResponse.submissions = submissions;

    const successResponse: responseType = {
      success: "true",
      status: 200,
      message: "profile fetched successfully",
      messages: [profileResponse],
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
