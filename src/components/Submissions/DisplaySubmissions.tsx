"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { submissionType } from "@/app/submissions/page";
import axios from "axios";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-red-600 dark:text-red-400";
  }
};

export default function DisplaySubmissions({
  submissions,
}: {
  submissions: submissionType[];
}) {
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const [currentSubmissions, setCurrentSubmissions] =
    useState<submissionType[]>(submissions);
  async function fetchSubmissions(currentPage: number) {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const res = await axios
      .get(
        `${domain}/api/latest-submissions?page=${currentPage}&limit=${limit}`,
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err?.response;
      });

    if (res?.data?.success === "true" && res?.data?.messages[0]) {
      return res.data.messages[0];
    }
    return null;
  }

  const handlePageChange = async (direction: string) => {
    let currentPage = page;
    if (direction === "next") {
      setPage(page + 1);
      currentPage += 1;
    } else {
      setPage(page - 1);
      currentPage -= 1;
    }

    const newSubmissions = await fetchSubmissions(currentPage);

    if (!newSubmissions || newSubmissions.length === 0) {
      setCurrentSubmissions([]);
    } else {
      setCurrentSubmissions(newSubmissions);
    }
  };

  const handlePageInc = async () => {
    await handlePageChange("next");
  };

  const handlePageDec = async () => {
    await handlePageChange("prev");
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[rgba(13,17,23)] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All My Submissions</h1>
      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[180px] font-semibold">
                  Time of Submission
                </TableHead>
                <TableHead className="font-semibold">Question</TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Status
                </TableHead>
                <TableHead className="w-[100px] font-semibold">
                  Language
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions.map((submission, index: number) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <TableCell className="font-medium">
                    {formatDate(submission.createdAt)}
                  </TableCell>
                  <Link href={`/submissions/${submission._id}`}>
                    <TableCell className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      {submission.problemId.problemName}
                    </TableCell>
                  </Link>
                  <TableCell className={getStatusColor(submission.status)}>
                    {submission.status}
                  </TableCell>
                  <TableCell>{submission.language}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {currentSubmissions.length === 0 && (
        <p className="text-center mt-4"> No more submissions</p>
      )}
      <div className="mt-4 flex justify-between pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePageDec}
          disabled={page === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Newer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePageInc}
          disabled={currentSubmissions.length === 0}
        >
          Older <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
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
