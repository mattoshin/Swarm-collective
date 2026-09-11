import "server-only";
import { Resend } from "resend";
export async function sendEmail(input:{to:string|string[];subject:string;html:string}){if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM)throw new Error("Email is not configured");const {error}=await new Resend(process.env.RESEND_API_KEY).emails.send({from:process.env.RESEND_FROM,...input});if(error)throw new Error(error.message)}
