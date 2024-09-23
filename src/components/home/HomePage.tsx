import React from "react";
import DisplayProblems from "./DisplayProblems";
import Courses from "./Courses";
import { problemsType } from "@/app/page";

export default function HomePage({ problems }: { problems: problemsType[] }) {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[rgba(13,17,23)] min-h-screen">
      <Courses />
      <DisplayProblems problems={problems} />
    </div>
  );
}
