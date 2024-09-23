"use client";
import React, { useState, useContext } from "react";
import { CodeIcon, LightbulbIcon } from "lucide-react";
import { TbFileDescription } from "react-icons/tb";
import ProblemRenderer from "./ProblemRenderer";
import SubmissionTable from "./SubmissionTable";
import axios from "axios";
import { ProblemContext } from "@/store/ProblemContextProvider";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type optionsType = "Description" | "Submissions" | "Solution";
export type submissionType = {
  language: string;
  time: string;
  memory: string;
  status: string;
  createdAt: string;
};

const ProblemHeader = ({
  problemDescription,
}: {
  problemDescription: string;
}) => {
  const [options, setOptions] = useState<optionsType>("Description");
  const [submissions, setSubmissions] = useState<submissionType[] | null>(null);
  const [error, setError] = useState(false);

  const { problemDetails } = useContext(ProblemContext);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const fetchSubmissions = async () => {
    const problemId = problemDetails?._id;
    const userId = session?.user?._id;
    if (!userId) {
      toast.error("Login to see submissions", {});
      return;
    }
    if (!problemId || !userId) {
      setError(true);
      return;
    }

    setLoading(true);
    await axios
      .post(`${domain}/api/submissions`, {
        problemId,
        userId,
      })
      .then((res) => {
        if (res?.data?.success === "true") {
          const response: submissionType[] = res?.data?.messages[0];
          setSubmissions(response);
        } else {
          toast.error("Unable to fetch submissions");
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSetSubmissions = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setOptions("Submissions");
    fetchSubmissions();
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
      ) : error ? (
        <div>
          <h1>Login to see submissions</h1>
        </div>
      ) : (
        <SubmissionTable submissions={submissions} loading={loading} />
      )}
    </>
  );
};

export default ProblemHeader;
