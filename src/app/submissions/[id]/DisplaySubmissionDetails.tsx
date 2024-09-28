"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { submissionDetailType } from "./page";
import Link from "next/link";

export default function DisplaySubmissionDetails({
  submissionDetails,
}: {
  submissionDetails: submissionDetailType;
}) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(submissionDetails.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-gray-200 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link href={`/problems/${submissionDetails.problemId.problemTitle}`}>
            <h2 className="text-2xl font-bold">
              {submissionDetails?.problemId?.problemName}
            </h2>
          </Link>
          <Button
            onClick={copyCode}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full lg:w-64 bg-gray-200 dark:bg-gray-800 p-4 border-b lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Submission Details</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Problem
              </p>
              <p className="font-medium">
                {submissionDetails.problemId.problemName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Language
              </p>
              <p>{submissionDetails.language}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <Badge
                className={`${
                  submissionDetails.status === "Accepted"
                    ? "bg-green-400 text-black dark:text-white"
                    : "bg-red-500 text-black  dark:text-white"
                }`}
              >
                {submissionDetails.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Time
              </p>
              <p>{submissionDetails.time} seconds</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Memory
              </p>
              <p>{submissionDetails.memory} KB</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Submitted At
              </p>
              <p>Date</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <Card className="m-4">
              <CardContent className="p-0">
                <pre className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    {submissionDetails.code.split("\n").map((line, index) => (
                      <div key={index} className="flex">
                        <span className="text-gray-500 w-8 sm:w-12 inline-block text-right mr-2 sm:mr-4">
                          {index + 1}
                        </span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
