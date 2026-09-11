import { NextResponse } from "next/server";
import { redeemMagicLink } from "@/lib/magic-link";
import { setSession } from "@/lib/session";
export async function GET(req:Request){const url=new URL(req.url);const token=url.searchParams.get("token");if(!token)return NextResponse.redirect(new URL("/enter?error=invalid",url.origin));const memberId=await redeemMagicLink(token);if(!memberId)return NextResponse.redirect(new URL("/enter?error=expired",url.origin));await setSession(memberId);return NextResponse.redirect(new URL("/welcome",url.origin))}
