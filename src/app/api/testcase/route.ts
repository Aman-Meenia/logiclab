import dbConnect from "@/db/dbConnect";
import DefaultTestCase from "@/models/defaultTestCaseModel";
import { responseType } from "@/types/problemType";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { fromZodError } from "zod-validation-error";

const testCaseTypeValidation = z
  .object({
    title: z.string().min(1, { message: "title is required" }),
    testCase1: z.string().min(1, { message: "TestCase1 is required" }),
    testCase2: z.string().min(1, { message: "TestCase2 is required" }),
    testCase3: z.string().min(1, { message: "TestCase3 is required" }),
  })
  .strict();

type testCaseRequestType = z.infer<typeof testCaseTypeValidation>;
//BUG: Handle error if user send empty json request it cuurently gives internal server error

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data: testCaseRequestType = await request.json();
    console.log("Data working");

    console.log(data);

    const zodResponse = testCaseTypeValidation.safeParse(data);

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };

      return NextResponse.json(errorResponse);
    }

    // Check if the test case already exists
    const testCaseExists = await DefaultTestCase.findOne({
      title: data.title,
    });

    if (testCaseExists) {
      // if already present update it

      await DefaultTestCase.updateOne(
        { _id: testCaseExists._id },
        {
          $set: {
            testCase1: data.testCase1,
            testCase2: data.testCase2,
            testCase3: data.testCase3,
          },
        },
      );

      const errorResponse: responseType = {
        message: "Test case with this title already exists",
        success: "true",
        messages: [{ _id: testCaseExists._id }],
        status: 200,
      };
      return NextResponse.json(errorResponse);
    }

    // As everything is fine store in database and return the id of the document

    const testCase = new DefaultTestCase(data);
    await testCase.save();

    const successResponse: responseType = {
      message: "Successfully saved the test cases",
      messages: [{ _id: testCase._id }],
      success: "true",
      status: 200,
    };

    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error while saving the test cases",
      success: "false",
      status: 500,
    };
    return NextResponse.json(errorResponse);
  }
}
