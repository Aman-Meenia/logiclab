import { resend } from "./resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmails(
  username: string,
  email: string,
  otp: string,
): Promise<ApiResponse> {
  try {
    const Response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Logic Lab | Verification Code",
      react: VerificationEmail({ username, otp }),
    });
    console.log(Response, "resend email response");

    return {
      success: true,
      message: "Verification Email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
