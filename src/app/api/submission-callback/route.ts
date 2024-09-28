import { responseType } from "@/types/problemType";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/db/redisConnect";
import fs from "fs";
import path from "path";
import { responseMsg } from "../../../../boilerPlateGenerator/src/readFiles/readFile";

const timeOut = 5 * 60;

//  status: { id: 4, description: 'Wrong Answer' }
//  status: {id:3 , description: 'Accepted'}
//   status: { id: 6, description: 'Compilation Error' }
//   status: {  id: 11, description:Runtime Error (NZEC) }
//   status: {id:5, description: 'Time Limit Exceeded' }

const convertBase64ToUtf8 = (str: string): string => {
  const ans = Buffer.from(str, "base64").toString("utf-8");
  return ans;
};

export async function PUT(request: NextRequest) {
  try {
    // console.log("--------------------------Start---------------------------");
    // console.log("Judge 0 callback called");
    const response = await request.json();
    // console.log(response);
    const token = response.token;

    const compileOutput = response?.compile_output;
    const TLEmessage = response?.message;

    let convertedComplieOutput = "";
    if (compileOutput) {
      convertedComplieOutput = convertBase64ToUtf8(compileOutput);
      // console.log("Compilation output");
      // console.log(convertedComplieOutput);
    }

    let convertedTLEMessage = "";
    if (TLEmessage) {
      convertedTLEMessage = convertBase64ToUtf8(TLEmessage);
      // console.log("Converted TLE MESSAGE -------->");
      // console.log(convertedTLEMessage);
    }

    const stdout = response?.stdout;

    let convertedStdout = "";
    if (stdout) {
      convertedStdout = convertBase64ToUtf8(stdout);
      // console.log("Stdout output");
      // console.log(convertedStdout);
    }

    if (!token) {
      const errorResponse: responseType = {
        message: "Token not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    // get the testCase number ( index) and its uuid

    const TestcaseNumber = await redis.get(token);

    if (!TestcaseNumber) {
      // console.log("Testcase not found");
      const errorResponse: responseType = {
        message: "Response not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const { uuid } = JSON.parse(TestcaseNumber);
    const status_id = uuid + "_status";

    // if wrong answer or the accpeted answer we need to check for all other testcase else we do not check
    // otherTestcase and make the cnt = 0 and give the output to the user

    const userDetail = await redis.get(status_id);
    if (!userDetail) {
      const errorResponse: responseType = {
        message: "Response not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const userResponse = JSON.parse(userDetail);

    // console.log(userResponse);
    const successResponse: responseType = {
      message: "Callback success",
      success: "true",
      status: 200,
    };

    // Read the output file as to compare the anwer for each testcase
    const outputFile = readOutputFiles(userResponse.problemTitle);
    // console.log("<-----outPutFile----->");
    // console.log(outputFile.response);
    // console.log(userResponse.problemTitle);
    if (
      response.status.id === 4 &&
      response.status.description === "Wrong Answer"
    ) {
      // console.log("Wrong answer ");

      userResponse.cnt = 0;
      userResponse.error = true;
      userResponse.time = response.time;
      userResponse.memory = response.memory;
      userResponse.stdout = response.stdout;
      userResponse.status = response.status.description;
      userResponse.stdout = convertedStdout;
      const output = splitString(userResponse.stdout);
      if (
        output[output.length - 1] === "" ||
        output[output.length - 1] === "\n"
      ) {
        output.pop();
      }
      let testcaseLength = output.length;
      if (userResponse.flag === "run") {
        testcaseLength = 3;
      }
      const testCaseResult = Array(testcaseLength).fill(true);
      // console.log(output);
      // console.log(outputFile.response);

      // if (output.length === outputFile.response.length) {
      for (let i = 0; i < testcaseLength; i++) {
        // console.log(output[i].trim(), " # ", outputFile.response[i].trim());
        if (output[i].trim() !== outputFile.response[i].trim()) {
          testCaseResult[i] = false;
          userResponse.status = "Wrong Answer";
          // console.log("value set to false");
        }
      }
      // }
      userResponse.testCaseResult = testCaseResult;

      await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);
      return NextResponse.json(successResponse);
    } else if (
      response.status.id === 3 &&
      response.status.description === "Accepted"
    ) {
      // console.log("Accepted");
      userResponse.cnt = 0;
      userResponse.time = response.time;
      userResponse.memory = response.memory;
      userResponse.stdout = response.stdout;
      userResponse.status = response.status.description;
      userResponse.stdout = convertedStdout;
      const output = splitString(userResponse.stdout);
      if (
        output[output.length - 1] === "" ||
        output[output.length - 1] === "\n"
      ) {
        output.pop();
      }
      let testcaseLength = output.length;
      if (userResponse.flag === "run") {
        testcaseLength = 3;
      }
      const testCaseResult = Array(testcaseLength).fill(true);
      if (output.length === outputFile.response.length) {
        for (let i = 0; i < testcaseLength; i++) {
          if (output[i].trim() !== outputFile.response[i].trim()) {
            testCaseResult[i] = false;
            userResponse.status = "Wrong Answer";
            // console.log("value set to false");
          }
        }
      }
      userResponse.testCaseResult = testCaseResult;

      await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);
      return NextResponse.json(successResponse);
    } else if (
      response.status.id === 6 &&
      response.status.description === "Compilation Error"
    ) {
      userResponse.cnt = 0;
      userResponse.error = true;
      userResponse.time = response.time;
      userResponse.memory = response.memory;
      userResponse.stdout = response.stdout;
      userResponse.compile_output = convertedComplieOutput;
      userResponse.status = response.status.description;
      await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);
      return NextResponse.json(successResponse);
    } else if (
      response.status.id === 11 &&
      response.status.description === "Runtime Error (NZEC)"
    ) {
      userResponse.cnt = 0;
      userResponse.error = true;
      userResponse.time = response.time;
      userResponse.memory = response.memory;
      userResponse.stdout = response.stdout;
      // userResponse.compile_output = "Runtime Error";
      userResponse.compile_output = convertedComplieOutput;

      userResponse.status = response.status.description;

      await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);

      return NextResponse.json(successResponse);
    } else if (
      response.status.id === 5 &&
      response.status.description === "Time Limit Exceeded"
    ) {
      userResponse.cnt = 0;
      userResponse.error = true;
      userResponse.time = response.time;
      userResponse.memory = response.memory;
      userResponse.stdout = response.stdout;
      userResponse.compile_output = convertedComplieOutput;
      userResponse.status = response.status.description;

      await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);
      return NextResponse.json(successResponse);
    }
    userResponse.cnt = 2;
    userResponse.time = response.time;
    userResponse.memory = response.memory;
    userResponse.stdout = response.stdout;
    userResponse.error = true;
    userResponse.compile_output = convertedComplieOutput;
    userResponse.status = response.status.description;

    await redis.set(status_id, JSON.stringify(userResponse), "EX", timeOut);

    return NextResponse.json(successResponse);

    //  When the multiple callback are called from the judge0 than the value which we get the
    // previouse value and sometime it works fine even when we user the multi set and get (transaction)
    //
    // const multi = redis.multi();
    // multi.get(status_id);
    //
    // const responseData = await multi.exec();
    // const result = responseData?.[0]?.[1];
    // console.log("Pre data is " + result);
    //
    // if (typeof result != "string") {
    //   const errorResponse: responseType = {
    //     message: "Response not found",
    //     success: "false",
    //     status: 400,
    //   };
    //   return NextResponse.json(errorResponse);
    // }
    // const parseResult = JSON.parse(result);
    //
    // if (parseResult.cnt === 0) {
    //   const errorResponse: responseType = {
    //     message: "All testcases are solved or the error occured in code",
    //     success: "false",
    //     status: 400,
    //   };
    //   return NextResponse.json(errorResponse);
    // }
    // parseResult.cnt -= 1;
    // parseResult.outputs[index] = true;
    //
    // // if cnt becomes zero update the status of the problem to true because now we can give output to the frontend
    //
    // // console.log("PARSE RESULT " + parseResult);
    // multi.set(status_id, JSON.stringify(parseResult));
    // await multi.exec();
    // const newDataIs = await redis.get(status_id);
    // console.log(newDataIs);

    // const successResponse: responseType = {
    //   message: "Testcase updated successfully",
    //   success: "true",
    //   status: 200,
    // };
  } catch (err) {
    // console.log("Error in submission callback  route ", err);
    const errorResponse: responseType = {
      message: "Internal server error while callback from judge0",
      success: "false",
      status: 500,
    };

    return NextResponse.json(errorResponse);
  }
}

// Read ouput file
const filepath = path.resolve(process.cwd(), "problems");
const readOutputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "output");

  if (!fs.existsSync(problempath)) {
    // console.log("File not found");
    return {
      success: false,
      errMessage: "File not found",
      response: [],
    };
  }

  const output: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const outputFilePath = path.join(problempath, `${i}.txt`);

    if (!fs.existsSync(outputFilePath)) {
      break;
    }
    const data = fs.readFileSync(outputFilePath, "utf-8");
    output.push(data);
  }

  return {
    success: true,
    response: output,
    errMessage: "No error",
  };
};

function splitString(input: string): string[] {
  const output: string[] = [];
  // console.log(input);
  input.split("$$$").map((str) => output.push(str));
  return output;
}
