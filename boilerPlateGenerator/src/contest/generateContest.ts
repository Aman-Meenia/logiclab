import fs from "fs";
import axios from "axios";
import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("Please provide the path of the input file");
  process.exit(1);
}

const fileName = process.argv[2];

// console.log(fileName);

// check if file exists or not

if (!fs.existsSync(fileName)) {
  console.log("File does not exist");
  process.exit(1);
}

// read the file content and parse it

const contestFileContent = fs.readFileSync(fileName, "utf-8");

// console.log(contestFileContent);

const lines = contestFileContent.split("\n");

interface Contest {
  contestName: string;
  description: string;
  contestCreator: string;
  startTime?: Date;
  endTime?: Date;
  problem1: string;
  problem2: string;
  problem3: string;
  problem4: string;
}

const contesetDetail: Contest = {
  contestName: "",
  description: "",
  contestCreator: "",
  problem1: "",
  problem2: "",
  problem3: "",
  problem4: "",
};
// console.log(contesetDetail);

for (let i = 0; i < 9; i++) {
  const line = lines[i];
  if (line.includes("contestName:")) {
    const contestName = line.split("contestName:")[1].trim();
    contesetDetail.contestName = contestName;
    // console.log(contestName);
  } else if (line.includes("description:")) {
    const description = line.split("description:")[1].trim();
    contesetDetail.description = description;
    // console.log(description);
  } else if (line.includes("contestCreator:")) {
    const contestCreator = line.split("contestCreator:")[1].trim();
    contesetDetail.contestCreator = contestCreator;
    // console.log(contestCreator);
  } else if (line.includes("startTime:")) {
    const startTime = line.split("startTime:")[1].trim();
    contesetDetail.startTime = new Date(startTime);
    // console.log(startTime);
  } else if (line.includes("endTime:")) {
    const endTime = line.split("endTime:")[1].trim();
    contesetDetail.endTime = new Date(endTime);
    // console.log(endTime);
  } else if (line.includes("problem1:")) {
    const problem1 = line.split("problem1:")[1].trim();
    contesetDetail.problem1 = problem1;
    // console.log(problem1);
  } else if (line.includes("problem2:")) {
    const problem2 = line.split("problem2:")[1].trim();
    contesetDetail.problem2 = problem2;
    // console.log(problem2);
  } else if (line.includes("problem3:")) {
    const problem3 = line.split("problem3:")[1].trim();
    contesetDetail.problem3 = problem3;
    // console.log(problem3);
  } else if (line.includes("problem4:")) {
    const problem4 = line.split("problem4:")[1].trim();
    contesetDetail.problem4 = problem4;
    // console.log(problem4);
  } else {
    console.log("Invalid Contest File");
    process.exit(1);
  }
}

// console.log(contesetDetail);

// check if any of the field is empty return error

const contesetDetailValidation = Object.values(contesetDetail).every(
  (value) => value !== "",
);

// console.log(contesetDetailValidation);

if (!contesetDetailValidation) {
  console.log("Contest Details are not valid");
  process.exit(1);
}

// check if the problem exists in the the database or not
const problemId: string[] = [];
const Domain = "http://localhost:3000";
const problemExistsAxiosFunction = async (title: string) => {
  // console.log("Titile is " + title);
  await axios
    .get(`${Domain}/api/problem/exists?title=${title}`)
    .then((response) => {
      if (response?.data?.success === "true") {
        problemId.push(response?.data?.messages[0].problem._id.toString());
      } else {
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.log(err?.response?.data?.message);
      process.exit(1);
    });
};

// add the contest to the database
// create the contest
interface ContestType {
  contestName: string;
  description: string;
  contestCreator: string;
  startTime: Date;
  endTime: Date;
  problems: {
    problem1: mongoose.Types.ObjectId;
    problem2: mongoose.Types.ObjectId;
    problem3: mongoose.Types.ObjectId;
    problem4: mongoose.Types.ObjectId;
  };
}
const addContestAxiosRequest = async (constestData: ContestType) => {
  await axios
    .post(`${Domain}/api/contest`, constestData)
    .then((response) => {
      if (response?.data?.success === "true") {
        console.log(response?.data?.message);
      } else {
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log(error?.response?.data?.message);
      process.exit(1);
    });
};

// function

const addContestToDatabase = async () => {
  await problemExistsAxiosFunction(contesetDetail.problem1);
  await problemExistsAxiosFunction(contesetDetail.problem2);
  await problemExistsAxiosFunction(contesetDetail.problem3);
  await problemExistsAxiosFunction(contesetDetail.problem4);
  // already check above but typescript is not happy so check it again
  if (!contesetDetail.startTime || !contesetDetail.endTime) {
    console.log("Contest Details are not valid");
    process.exit(1);
  }

  const constestData: ContestType = {
    contestName: contesetDetail.contestName,
    description: contesetDetail.description,
    contestCreator: contesetDetail.contestCreator,
    startTime: contesetDetail.startTime,
    endTime: contesetDetail.endTime,
    problems: {
      problem1: new mongoose.Types.ObjectId(problemId[0]),
      problem2: new mongoose.Types.ObjectId(problemId[1]),
      problem3: new mongoose.Types.ObjectId(problemId[2]),
      problem4: new mongoose.Types.ObjectId(problemId[3]),
    },
  };

  await addContestAxiosRequest(constestData);
};

addContestToDatabase();
