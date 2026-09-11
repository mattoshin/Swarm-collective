import "server-only";
import { Resend } from "resend";
export function escapeHtml(value:string){return value.replace(/[&<>'"]/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[character] as string)}
export async function sendEmail(input:{to:string|string[];subject:string;html:string;text?:string}){if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM)throw new Error("Email is not configured");const {error}=await new Resend(process.env.RESEND_API_KEY).emails.send({from:process.env.RESEND_FROM,...input});if(error)throw new Error(error.message)}
