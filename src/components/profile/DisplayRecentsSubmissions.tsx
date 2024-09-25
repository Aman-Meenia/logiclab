"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2 } from "lucide-react";
import { submissionProfileType } from "@/app/profile/page";

const DisplayRecentsSubmissions = ({
  submissions,
}: {
  submissions: submissionProfileType[];
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
          Recent Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4  ">
          {submissions.map((problem: submissionProfileType, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/30 hover:dark:bg-gray-700/50 transition-colors"
            >
              <span className="text-sm md:text-base">
                {problem?.problemId?.problemName}
              </span>
              <span className="text-xs md:text-sm flex dark:text-gray-100 items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(problem?.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayRecentsSubmissions;

function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
}
