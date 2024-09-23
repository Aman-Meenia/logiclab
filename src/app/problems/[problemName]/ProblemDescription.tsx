"use client";
import React, { useContext, useEffect } from "react";
import { defaultCodeType, defaultTestCaseType } from "./page";
import ProblemHeader from "./ProblemHeader";
import ProblemRenderer from "./ProblemRenderer";
import Editor from "@/components/editor/Editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ProblemContext,
  problemContextType,
} from "@/store/ProblemContextProvider";

const ProblemDescription = ({
  problemDescription,
  defaultTestCase,
  defaultCode,
  selectedProblem,
}: {
  problemDescription: string;
  defaultTestCase: defaultTestCaseType;
  defaultCode: defaultCodeType;
  selectedProblem: problemContextType;
}) => {
  const { setProblemSelected, setProblemDetails } = useContext(ProblemContext);

  useEffect(() => {
    if (selectedProblem) setProblemSelected(selectedProblem);
    if (selectedProblem && problemDescription) {
      setProblemDetails({
        description: problemDescription,
        defaultTestCase: defaultTestCase,
        defaultCode: defaultCode,
        _id: selectedProblem._id,
        difficulty: selectedProblem.difficulty,
        problemName: selectedProblem.problemName,
        problemTitle: selectedProblem.problemTitle,
        problemNumber: selectedProblem.problemNumber,
      });
    }
  }, [selectedProblem, ProblemDescription]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-60px)] p-1 gap-1 bg-black"
    >
      <ResizablePanel defaultSize={50}>
        <div className="bg-[rgba(13,17,23)] h-full rounded-sm flex flex-col p-1">
          <ProblemHeader problemDescription={problemDescription} />
          {/* <ProblemRenderer problemDescription={problemDescription} /> */}
        </div>
      </ResizablePanel>
      <ResizableHandle className="w-1 bg-gray-600" />
      <ResizablePanel defaultSize={50}>
        <Editor defaultTestCase={defaultTestCase} defaultCode={defaultCode} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProblemDescription;
