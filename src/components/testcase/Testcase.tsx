"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RenderTestCaseInput from "./RenderTestCaseInput";
import { TbCheckbox } from "react-icons/tb";
import { TerminalIcon } from "lucide-react";
import { defaultTestCaseType, outputType } from "../editor/Editor";
import RenderTestCaseOutput from "./RenderTestCaseOutput";
export type testCaseType = {
  id: number;
  code: string;
};
const Testcase = ({
  defaultTestCase,
  userCodeOutput,
}: {
  defaultTestCase: defaultTestCaseType;
  userCodeOutput: outputType | null;
}) => {
  const cases: testCaseType[] = [
    {
      id: 1,
      code: String(defaultTestCase.testCase1),
    },
    {
      id: 2,
      code: String(defaultTestCase.testCase2),
    },
    {
      id: 3,
      code: String(defaultTestCase.testCase3),
    },
  ];
  const [testCase, setTestCase] = useState<testCaseType[]>(cases);
  const [selectedTestcase, setSelectedTestCase] = useState(1);
  const [testCaseSelected, setTestCaseSelected] = useState(true);

  useEffect(() => {
    if (userCodeOutput) setTestCaseSelected(false);
  }, [userCodeOutput]);
  return (
    <ScrollArea>
      <div className="flex justify-start gap-3 py-[9px] h-[40px] px-3 rounded-sm bg-[rgba(13,30,50)] text-gray-500">
        <div
          className={` ${testCaseSelected ? "text-white" : ""} flex gap-2 `}
          onClick={() => {
            setTestCaseSelected(true);
          }}
        >
          <TbCheckbox size={20} />
          TestCase
        </div>
        <div
          className={` ${testCaseSelected ? "" : "text-white"} flex gap-2 `}
          onClick={() => {
            setTestCaseSelected(false);
          }}
        >
          <TerminalIcon size={20} />
          TestResult
        </div>
      </div>

      {testCaseSelected ? (
        <>
          <div className="flex  gap-2 pt-3 pb-4 ">
            {testCase.map((testCase: testCaseType) => (
              <div
                key={testCase.id}
                className={`${
                  selectedTestcase === testCase.id
                    ? " bg-[rgba(22,27,34)]  rounded-md cursor-default"
                    : "cursor-pointer"
                } px-2 py-1`}
                onClick={() => {
                  if (selectedTestcase !== testCase.id) {
                    setSelectedTestCase(testCase.id);
                  }
                }}
              >
                {"Case " + testCase.id}
              </div>
            ))}
          </div>
          <RenderTestCaseInput
            testCaseInput={cases[selectedTestcase - 1].code}
          />
        </>
      ) : (
        <RenderTestCaseOutput
          userCodeOutput={userCodeOutput}
          testCaseInput={cases[selectedTestcase - 1]}
          cases={cases}
        />
      )}
      {/* <RenderTestCaseInput testCaseInput={cases[selectedTestcase - 1].code} /> */}
    </ScrollArea>
  );
};

export default Testcase;
