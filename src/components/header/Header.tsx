"use client";

import React, { useState } from "react";
import { ModeToggle } from "../theme/ToggleButton";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };
  const handleProfile = () => {
    router.push("/profile");
    setPopoverOpen(false);
  };
  const getUserInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const truncateUsername = (username: string) => {
    return username.length > 20 ? username.slice(0, 20) + "..." : username;
  };

  return (
    <div className="flex justify-between items-center p-2.5">
      <div className="flex items-center">
        <h1
          className={`text-[24px] font-bold ${
            path === "/" ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={() => {
            path !== "/" && router.push("/");
          }}
        >
          Logic Lab
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {session ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(session.user?.username || "Username")}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              className="w-65  mt-2 mr-2 p-4"
              align="end"
              alignOffset={-50}
            >
              <div className="space-y-4">
                <div
                  className="flex items-center space-x-2 hover:cursor-pointer  hover:bg-accent  p-2 rounded-md"
                  onClick={handleProfile}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(session.user?.username || "Username")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    {truncateUsername(session.user?.username || "Username")}
                  </div>
                </div>
                <div className="flex justify-start pt-2 border-t">
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-red-500 hover:text-red-600 hover:bg-accent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={() => {
              path !== "/login" && router.push("/login");
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
