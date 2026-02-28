import { Resend } from "resend";

export const emailConfig = new Resend(process.env.RESEND_API_KEY);

export const emailDefaults = {
  from: process.env.EMAIL_FROM as string,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL as string,
  brand: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Alkitu",
    color: "#000000",
    textColor: "#FFFFFF"
  }
}; 