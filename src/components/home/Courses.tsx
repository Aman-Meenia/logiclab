"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Code, BookOpen } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "DSA",
    description: "Boost your DSA skills with our handy cheat sheets.",
    icon: FileText,
    iconBg: "bg-blue-600",
  },
  {
    id: 2,
    title: "Dynamic Programming",
    description: "Master DP with our simplified approach.",
    icon: Code,
    iconBg: "bg-red-600",
  },
  {
    id: 3,
    title: "Technical Blogs",
    description: "Dive Deep into Tech Innovation with Our Engaging Blogs.",
    icon: BookOpen,
    iconBg: "bg-pink-600",
  },
];

export default function Courses() {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 hover:dark:border-zinc-700 transition-all duration-300 rounded-xl overflow-hidden group"
            >
              <CardHeader className="p-6">
                <div
                  className={`${course.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <course.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold dark:text-white group-hover:text-gray-500 group-hover:dark:text-gray-300 transition-colors duration-300">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-sm dark:text-zinc-400 text-gray-500  group-hover:text-black group-hover:dark:text-zinc-300 transition-colors duration-300">
                  {course.description}
                </p>
                {/* <Button */}
                {/*   variant="outline" */}
                {/*   className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-gray-100 transition-all duration-300" */}
                {/* > */}
                {/*   Try it free */}
                {/*   <span className="group-hover:translate-x-1 transition-transform duration-300"> */}
                {/*     → */}
                {/*   </span> */}
                {/* </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
