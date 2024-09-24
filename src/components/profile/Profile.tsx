"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Shield, Star, Target, Zap } from "lucide-react";
import { profileType } from "@/app/profile/page";
import DisplayRecentsSubmissions from "./DisplayRecentsSubmissions";
import { useRouter } from "next/navigation";

const ProfilePage = ({ profileDetails }: { profileDetails: profileType }) => {
  const problemSets = [
    {
      type: "Easy",
      solved: profileDetails.easySolvedCount,
      total: profileDetails.easyProblemCount,
      color: "text-green-500 dark:text-green-400",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      type: "Med.",
      solved: profileDetails.mediumSolvedCount,
      total: profileDetails.mediumProblemCount,
      color: "text-yellow-500 dark:text-yellow-400",
      icon: <Target className="w-5 h-5" />,
    },
    {
      type: "Hard",
      solved: profileDetails.hardSolvedCount,
      total: profileDetails.hardProblemCount,
      color: "text-red-500 dark:text-red-400",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgba(13,17,23)]  text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 border-4 border-blue-500 shadow-lg">
                <AvatarImage
                  src={profileDetails.username}
                  alt={profileDetails.username}
                />
                <AvatarFallback>
                  {profileDetails.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">
                  {profileDetails.username}
                </h1>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  Coding Enthusiast
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Solved Problems
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-36 h-36 md:w-44 md:h-44">
                  <Progress
                    value={
                      (profileDetails.totalSolvedCount /
                        profileDetails.totalProblemCount) *
                      100
                    }
                    className="w-36 h-36 md:w-44 md:h-44 [&>div]:stroke-blue-500 [&>div]:stroke-[12px] rounded-full"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {profileDetails.totalSolvedCount}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /{profileDetails.totalProblemCount}
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                      ✓ Solved
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {problemSets.map((set, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {set.icon}
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-md"
                      >
                        {set.type}
                        <span className={`ml-2 ${set.color}`}>
                          {set.solved}/{set.total}
                        </span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DisplayRecentsSubmissions submissions={profileDetails.submissions} />
        <div className="text-right">
          <Button
            variant="outline"
            className=" dark:text-gray-100 text-blue-600  border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-colors"
            onClick={() => {
              router.push("/submissions");
            }}
          >
            View all submissions <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
