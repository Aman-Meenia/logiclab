"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Shield } from "lucide-react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgba(13,17,23)] text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Profile Card */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="text-center md:text-left">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solved Problems Card */}
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
                <Skeleton className="w-full h-full rounded-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Skeleton className="h-10 w-20 mb-1" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions Card */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* View All Submissions Button */}
        <div className="text-right">
          <Skeleton className="h-10 w-48 inline-block" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
