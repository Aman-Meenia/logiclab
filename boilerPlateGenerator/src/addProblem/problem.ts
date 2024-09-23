import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import axios from "axios";
const Domain = "http://localhost:3000";

export interface ProblemType {
  problemNumber: number;
  type: "contest" | "regularProblem";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  problemName: string;
  problemTitle: string;
  defaultTestCase: mongoose.Types.ObjectId;
  defaultCode: mongoose.Types.ObjectId;
}

const newProblem: ProblemType = {
  problemNumber: 1,
  type: "regularProblem",
  difficulty: "easy",
  description: "",
  problemName: "",
  problemTitle: "",
  defaultTestCase: new mongoose.Types.ObjectId(),
  defaultCode: new mongoose.Types.ObjectId(),
};

let updateProblem = false;

//TODO:  Firstly check if the user is admin or not (Only Admin can add the problem to database)

// check if folder paht is provided as argument

// console.log(process.argv);
if (process.argv.length < 4) {
  console.log("Folder path is missing and secret is missing.");
  process.exit(1);
}

if (process.argv.length == 5) {
  if (process.argv[4] === "update") {
    updateProblem = true;
  }
  // console.log("Update problem " + updateProblem);
}

// Folder path

const folderPath = process.argv[2];
const Title = folderPath.substring(folderPath.lastIndexOf("/") + 1);
// console.log("Title is " + Title);
// console.log("Folder path  " + folderPath);

const adminSecret = process.argv[3];

// console.log("Admin secret " + adminSecret);

//TODO: Check if the secret is correct or not

// check if folder exists

if (!fs.existsSync(folderPath)) {
  console.log("Folder does not exist");
  process.exit(1);
}

// Read structure.md file
const problemMdFilePath = path.join(folderPath, "problem.md");

// check if the structure.md file exists in the provided  problem folder

if (!fs.existsSync(problemMdFilePath)) {
  console.log(`structure.md file does not exist in  path ${folderPath}`);
  process.exit(1);
}

newProblem.description = fs.readFileSync(problemMdFilePath, "utf-8");

// console.log(newProblem);

// Get Function Name , Type , Difficulty   from the structure.md file

// check if the structure.md file exists

const structureMdFilePath = path.join(folderPath, "structure.md");

// check if the structure.md file exists in the provided  problem folder

if (!fs.existsSync(structureMdFilePath)) {
  console.log(`structure.md file does not exist in  path ${folderPath}`);
  process.exit(1);
}

// Read the file structure.md

const structureMd = fs.readFileSync(structureMdFilePath, "utf-8");

const lines = structureMd.split("\n").map((line) => line.trim());
const extractValue = (line: string): string => {
  const match = line.match(/"(.*?)"/);

  return match && match[1] ? match[1] : "";
};

lines.forEach((line) => {
  if (line.startsWith("Problem Name:")) {
    const problemName: string = extractValue(line);
    if (problemName === "") {
      console.log("Problem Name is missing");
      process.exit(1);
    }

    newProblem.problemName = problemName;
  } else if (line.startsWith("Difficulty:")) {
    const difficultyFun = extractValue(line);
    if (
      difficultyFun === "" ||
      !["easy", "medium", "hard"].includes(difficultyFun)
    ) {
      console.log("Difficulty of problem is missing");
      process.exit(1);
    }
    const difficulty = difficultyFun as "easy" | "medium" | "hard";

    newProblem.difficulty = difficulty;
  } else if (line.startsWith("Type:")) {
    const typeFun = extractValue(line);
    if (typeFun === "" || !["contest", "regularProblem"].includes(typeFun)) {
      console.log("Type of problem is missing");
      process.exit(1);
    }
    const type = typeFun as "contest" | "regularProblem";

    newProblem.type = type;
  }
});

// console.log(newProblem);
// As we have the title of the problem check if the problem with same title already present if present and update flag is false exit

let problemAlreadyExists = false;
const problemWithTitleExists = async () => {
  await axios
    .get(`${Domain}/api/problem/${Title}`)
    .then((response) => {
      // console.log(response.data);
      // console.log(response.data.messages[0].problem);

      if (response.data.success === "true") {
        newProblem.problemNumber =
          response?.data?.messages[0]?.problem?.problemNumber;
        // console.log("Problem with same title already exists");
        problemAlreadyExists = true;
      } else {
        // console.log(
        // "You are trying to update the problem which is not present",
        // );
        // console.log(response?.data?.message);
        // process.exit(1);
      }
    })
    .catch((error) => {
      // console.log("Error while adding problem to the database");
      console.log(error.response.message);
      // console.log(error?.message);
      process.exit(1);
    });
};

//TODO: Generate the Default TestCase from input/output for first 3 test cases

// Get Default tescase from input/output Folder

// check if the input/output folder exists in the provided  problem folder

const inputFolderPath = path.join(folderPath, "input");
const outputFolderPath = path.join(folderPath, "output");

if (!fs.existsSync(inputFolderPath)) {
  console.log(`input folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

if (!fs.existsSync(outputFolderPath)) {
  console.log(`output folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

// console.log("Input folder path " + inputFolderPath);
// console.log("Output folder path " + outputFolderPath);

// Get the boiler plate code and store in db

// check if the the boilerplate folder exists and the boilerplate code file exists
// in the boilerplate folder

const boilerplatePath = path.join(folderPath, "boilerplate");

if (!fs.existsSync(boilerplatePath)) {
  console.log(`boilerplate folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

const boilerplatePathCpp = path.join(boilerplatePath, "boilerplate-cpp.txt");
// console.log(boilerplatePathCpp);

if (!fs.existsSync(boilerplatePathCpp)) {
  console.log(`C++ folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

const boilerplatePathJs = path.join(boilerplatePath, "boilerplate-js.txt");

if (!fs.existsSync(boilerplatePathJs)) {
  console.log(`JavaScript folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

const boilerplatePathTs = path.join(boilerplatePath, "boilerplate-ts.txt");

if (!fs.existsSync(boilerplatePathTs)) {
  console.log(`TypeScript folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

// Read the code for C++ , js and ts from the boilerplate folder

const cppDefaultCode = fs.readFileSync(boilerplatePathCpp, "utf-8");

const jsDefaultCode = fs.readFileSync(boilerplatePathJs, "utf-8");

const tsDefaultCode = fs.readFileSync(boilerplatePathTs, "utf-8");

// console.log("Cpp code " + typeof cppDefaultCode);

// console.log(cppDefaultCode);
// console.log(jsDefaultCode);
// console.log(tsDefaultCode);

// Get the defaultTescase from the folder defaultTC (defaultTC1.md , defaultTC2.md , defaultTC3.md)

// check if the defaultTC folder exists in the provided problem folder

const defaultTCFolderPath = path.join(folderPath, "defaultTC");

if (!fs.existsSync(defaultTCFolderPath)) {
  console.log(`defaultTC folder does not exist in  path ${folderPath}`);
  process.exit(1);
}

// check if the defaultTC1.md , defaultTC2.md , defaultTC3.md  file exists in the defaultTC folder

const defaultTC1FilePath = path.join(defaultTCFolderPath, "defaultTC1.md");
const defaultTC2FilePath = path.join(defaultTCFolderPath, "defaultTC2.md");
const defaultTC3FilePath = path.join(defaultTCFolderPath, "defaultTC3.md");

if (!fs.existsSync(defaultTC1FilePath)) {
  console.log(
    `defaultTC1.md file does not exist in  path ${defaultTCFolderPath}`,
  );
  process.exit(1);
}

if (!fs.existsSync(defaultTC2FilePath)) {
  console.log(
    `defaultTC2.md file does not exist in  path ${defaultTCFolderPath}`,
  );
  process.exit(1);
}

if (!fs.existsSync(defaultTC3FilePath)) {
  console.log(
    `defaultTC3.md file does not exist in  path ${defaultTCFolderPath}`,
  );
  process.exit(1);
}

// Now read the defaultTC1.md , defaultTC2.md , defaultTC3.md

const defaultTC1 = fs.readFileSync(defaultTC1FilePath, "utf-8");
const defaultTC2 = fs.readFileSync(defaultTC2FilePath, "utf-8");
const defaultTC3 = fs.readFileSync(defaultTC3FilePath, "utf-8");

// As we have Default code , Default testCase description save it in database and return the id
const defaultCodeAxiosFunction = async () => {
  await axios
    .post(`${Domain}/api/defaultcode`, {
      title: Title,
      cppCode: cppDefaultCode,
      tsCode: tsDefaultCode,
      jsCode: jsDefaultCode,
    })
    .then((response) => {
      if (response?.data?.success === "true") {
        console.log("Default code added successfully");
        newProblem.defaultCode = response?.data?.messages[0]?._id;
      } else {
        console.log("Error while adding default code to the database");
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log("Error while adding default code to the database");
      console.log(error.response);
      process.exit(1);
    });
};

// To get the cnt number of the problem

const problemCntAxiosFunction = async () => {
  await axios
    .get(`${Domain}/api/problemcnt`)
    .then((response) => {
      if (response?.data?.success === "true") {
        if (
          response?.data?.messages[0]?.cnt?.cnt === null ||
          response?.data?.messages[0]?.cnt?.cnt === undefined
        ) {
          // console.log("Problem cnt " + newProblem.problemNumber);
          newProblem.problemNumber = 1;
        } else {
          // console.log("Problem cnt  2 " + newProblem.problemNumber);
          newProblem.problemNumber = response?.data?.messages[0]?.cnt?.cnt;
        }
      } else {
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log(error.response);
      process.exit(1);
    });
};

// To increase the cnt number of the problem
const increaseProblemCntAxiosFunction = async () => {
  await axios
    .patch(`${Domain}/api/problemcnt`)
    .then((response) => {
      if (response?.data?.success === "true") {
        console.log(response?.data?.message);
        newProblem.problemNumber = response?.data?.messages[0]?.cnt?.cnt;
        // console.log("Increase cnt " + newProblem.problemNumber);
      } else {
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log(error.response);
      process.exit(1);
    });
};

// check if the problem with the problem number already exists

const problemExistsAxiosFunction = async () => {
  await axios
    .get(
      `${Domain}/api/problem?start=${newProblem.problemNumber}&end=${newProblem.problemNumber}`,
    )
    .then((response) => {
      if (response?.data?.success === "true") {
        if (response?.data?.messages[0]?.problems?.length > 0) {
          newProblem.problemNumber = 0;
        }
      }
    })
    .catch((error) => {
      console.log(error.response);
      process.exit(1);
    });
};

const defaultTestCaseAxiosFunction = async () => {
  await axios
    .post(`${Domain}/api/testcase`, {
      title: Title,
      testCase1: defaultTC1,
      testCase2: defaultTC2,
      testCase3: defaultTC3,
    })
    .then((response) => {
      if (response?.data?.success === "true") {
        console.log("Default test case added successfully");
        newProblem.defaultTestCase = response?.data?.messages[0]?._id;
      } else {
        console.log("Error while adding default test case to the database");
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log("Error while adding default test case to the database");
      console.log(error.response);
      process.exit(1);
    });
};

// Get the problem cnt and check if the

// Add the problem to the databse

const problemAxiosFunction = async () => {
  await axios
    .post(`${Domain}/api/problem`, {
      problemNumber: newProblem.problemNumber,
      type: newProblem.type,
      difficulty: newProblem.difficulty,
      description: newProblem.description,
      problemName: newProblem.problemName,
      problemTitle: newProblem.problemTitle,
      defaultTestCase: newProblem.defaultTestCase,
      defaultCode: newProblem.defaultCode,
    })
    .then((response) => {
      // console.log(response.data);
      if (response?.data?.success === "true") {
        // console.log("Problem added successfully");
        console.log(response?.data?.message);
      } else {
        console.log("Error while adding problem to the database");
        console.log(response?.data?.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.log("Error while adding problem to the database");

      console.log(error.response.data);
      process.exit(1);
    });
};

// update problem function

const updateProblemAxiosFunction = async () => {
  await axios
    .patch(`${Domain}/api/problem`, {
      problemNumber: newProblem.problemNumber,
      type: newProblem.type,
      difficulty: newProblem.difficulty,
      description: newProblem.description,
      problemName: newProblem.problemName,
      problemTitle: newProblem.problemTitle,
      defaultTestCase: newProblem.defaultTestCase,
      defaultCode: newProblem.defaultCode,
    })
    .then((response) => {
      if (response?.data?.success === "true") {
        console.log(response?.data?.message);
      } else {
        console.log(response?.data?.message);
        process.exit(1);
      }
    });
};

// Axios function

const addProblemFun = async () => {
  await problemWithTitleExists();
  if (updateProblem === true && problemAlreadyExists === false) {
    console.log("Problem not found");
    process.exit(1);
  }
  if (updateProblem === false && problemAlreadyExists === true) {
    console.log(
      "Problem with same title already exists and you are trying to add the problem with same title",
    );
    process.exit(1);
  }
  await defaultCodeAxiosFunction();
  await defaultTestCaseAxiosFunction();
  await problemCntAxiosFunction();

  // check if the problem with same problem cnt already present
  // console.log("Problem Already exists " + problemAlreadyExists);
  if (updateProblem === false) {
    await problemExistsAxiosFunction();

    if (newProblem.problemNumber === 0) {
      await increaseProblemCntAxiosFunction();
    }
  }
  newProblem.problemTitle = Title;

  if (updateProblem === true) {
    await updateProblemAxiosFunction();
  } else {
    await problemAxiosFunction();
  }
  // console.log(newProblem);
};

addProblemFun();
