"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SubmissionsSkeleton() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[rgba(13,17,23)] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All My Submissions</h1>

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[180px] font-semibold">
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead className="font-semibold">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="w-[150px] font-semibold">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="w-[100px] font-semibold">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4 flex justify-between pb-4">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" /> Newer
        </Button>
        <Button variant="outline" size="sm" disabled>
          Older <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
