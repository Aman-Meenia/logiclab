import React from "react";
import axios from "axios";
import { Link } from "lucide-react";
import ProblemDescription from "./ProblemDescription";
import { problemContextType } from "@/store/ProblemContextProvider";

export interface defaultTestCaseType {
  testCase1: string;
  testCase2: string;
  testCase3: string;
}

export interface defaultCodeType {
  cppCode: string;
  tsCode: string;
  jsCode: string;
}
// Define the type for problemDescription
export interface ProblemDescriptionType {
  description: string;
  defaultTestCase: defaultTestCaseType;
  defaultCode: defaultCodeType;
  _id: string;
  difficulty: "easy" | "medium" | "hard";
  problemName: string;
  problemTitle: string;
  problemNumber: number;
}

const problemNotFound: ProblemDescriptionType = {
  description: "Problem not found",
  defaultTestCase: {
    testCase1: "",
    testCase2: "",
    testCase3: "",
  },
  defaultCode: {
    cppCode: "",
    tsCode: "",
    jsCode: "",
  },
  _id: "",
  difficulty: "easy",
  problemName: "",
  problemTitle: "",
  problemNumber: 0,
};

const domain = process.env.NEXT_PUBLIC_DOMAIN;

async function fetchProblemData(problemName: string) {
  const problemDescription: ProblemDescriptionType = await axios
    .get(`${domain}/api/problem/${problemName}`)
    .then((response) => {
      if (response.data.success === "true") {
        const data = response.data.messages[0].problem;
        return data;
      }

      return problemNotFound;
    })
    .catch((err) => {
      return problemNotFound;
    });
  return problemDescription;
}

const ProblemPage = async ({ params }: { params: { problemName: string } }) => {
  const problemDescription = await fetchProblemData(params.problemName);
  if (
    !problemDescription ||
    problemDescription.description === "Problem not found"
  ) {
    //TODO: Add the custom 404 page
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <p>Oops! The requested page does not exist.</p>
        <Link href="/">
          <a>Go back home</a>
        </Link>
      </div>
    );
  } else {
    // console.log("<------------------Description------------------->");
    // console.log("Problem Description is " + problemDescription);
    // console.log(problemDescription);

    // console.log(problemDescription.defaultCode);

    const selectedProblem: problemContextType = {
      difficulty: problemDescription?.difficulty,
      problemName: problemDescription?.problemName,
      problemTitle: problemDescription?.problemTitle,
      _id: problemDescription._id,
      problemNumber: problemDescription?.problemNumber,
    };

    return (
      <ProblemDescription
        problemDescription={problemDescription.description}
        defaultTestCase={problemDescription?.defaultTestCase}
        defaultCode={problemDescription?.defaultCode}
        selectedProblem={selectedProblem}
      />
    );
  }
};

export default ProblemPage;
