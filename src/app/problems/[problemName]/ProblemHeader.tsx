"use client";
import React, { useState } from "react";
import { CodeIcon, LightbulbIcon } from "lucide-react";
import { TbFileDescription } from "react-icons/tb";
import ProblemRenderer from "./ProblemRenderer";
import SubmissionTable from "./SubmissionTable";

type optionsType = "Description" | "Submissions" | "Solution";

const ProblemHeader = ({
  problemDescription,
}: {
  problemDescription: string;
}) => {
  const [options, setOptions] = useState<optionsType>("Description");

  const handleSetSubmissions = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setOptions("Submissions");
  };
  const handleSetDescription = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setOptions("Description");
  };
  const handleSetSolution = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setOptions("Solution");
  };

  return (
    <>
      <div className="flex justify-start gap-4 py-[9px] h-[40px] px-3 rounded-sm bg-[rgba(13,30,50)] text-gray-500">
        <div
          className={`${options === "Description" ? "text-white" : ""} flex gap-2 hover:text-[white]  `}
          onClick={handleSetDescription}
        >
          <TbFileDescription size={20} />
          Description
        </div>
        <div
          className={`${options === "Solution" ? "text-white" : ""}  flex gap-2 hover:text-[white]`}
          onClick={handleSetSolution}
        >
          <LightbulbIcon size={20} />
          Solution
        </div>
        <div
          className={`${options === "Submissions" ? "text-white" : ""}  flex gap-2 hover:text-[white]`}
          onClick={handleSetSubmissions}
        >
          <CodeIcon size={20} />
          Submissions
        </div>
      </div>
      {options === "Description" ? (
        <ProblemRenderer problemDescription={problemDescription} />
      ) : options === "Solution" ? (
        <div className="text-lg"> Currently solutions are not avaliable </div>
      ) : (
        <SubmissionTable />
      )}
    </>
  );
};

export default ProblemHeader;
