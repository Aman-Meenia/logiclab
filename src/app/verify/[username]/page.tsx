"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const VerifyAccountPage = () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const params = useParams<{ username: string }>();
  const { username } = params;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: { otp: string }) => {};

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100 dark:bg-[rgba(13,17,23)]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Verify Your Account
            </h2>
            <p className="mb-4">
              Enter the Verification OTP(One-Time Password) sent to your email
              for the user {username}
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full sm:w-2/3 mx-auto space-y-8"
            >
              <FormField
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormLabel className="sr-only">One-Time Password</FormLabel>
                    <FormControl className="w-full max-w-[300px]">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="dark:border-black"
                          />
                          <InputOTPSlot
                            index={1}
                            className="dark:border-black"
                          />
                          <InputOTPSlot
                            index={2}
                            className="dark:border-black"
                          />
                          <InputOTPSlot
                            index={3}
                            className="dark:border-black"
                          />
                          <InputOTPSlot
                            index={4}
                            className="dark:border-black"
                          />
                          <InputOTPSlot
                            index={5}
                            className="dark:border-black"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  className="w-full max-w-[300px]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      verifying
                    </>
                  ) : (
                    "Verify Otp"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VerifyAccountPage;
