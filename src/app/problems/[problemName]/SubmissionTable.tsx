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
import { Badge } from "@/components/ui/badge";

type StatusEntry = {
  language: string;
  time: string;
  memory: string;
  status: string;
  createdAt: string;
};

const statusData: StatusEntry[] = [
  {
    language: "cpp",
    status: "Wrong Answer",
    time: "0.011",
    memory: "3432",
    createdAt: "2024-09-21T12:39:10.483Z",
  },
  {
    language: "cpp",
    status: "Wrong Answer",
    time: "0.02",
    memory: "3240",
    createdAt: "2024-09-21T12:43:36.108Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "easy":
      return "bg-green-500 hover:bg-green-600";
    default:
      return "bg-red-500 hover:bg-red-600";
  }
};

export default function SubmissionTable() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Large screens: Table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statusData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.language}</TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.memory}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>{entry.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
