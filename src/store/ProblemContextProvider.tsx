"use client";
import React, { createContext } from "react";

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

export type problemContextType = {
  problemNumber: number;
  difficulty: "easy" | "medium" | "hard";
  problemName: string;
  problemTitle: string;
  _id: string;
};

export type problemDetailsType = {
  defaultTestCase: defaultTestCaseType;
  defaultCode: defaultCodeType;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  problemTitle: string;
  problemName: string;
  problemNumber: number;
  _id: string;
};

type selectedProblemContext = {
  problemSelected: problemContextType | null;
  setProblemSelected: React.Dispatch<
    React.SetStateAction<problemContextType | null>
  >;
  problemDetails: problemDetailsType | null;
  setProblemDetails: React.Dispatch<
    React.SetStateAction<problemDetailsType | null>
  >;
};

export const ProblemContext = createContext<selectedProblemContext>({
  problemSelected: null,
  setProblemSelected: () => {},
  problemDetails: null,
  setProblemDetails: () => {},
});

export const ProblemContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [problemSelected, setProblemSelected] =
    React.useState<problemContextType | null>(null);
  const [problemDetails, setProblemDetails] =
    React.useState<problemDetailsType | null>(null);

  return (
    <ProblemContext.Provider
      value={{
        problemSelected,
        setProblemSelected,
        problemDetails,
        setProblemDetails,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};
