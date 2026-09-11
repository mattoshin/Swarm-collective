"use server";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { getServiceClient } from "@/lib/supabase";
export async function dismissBookmark(){const member=await getCurrentMember();if(!member)redirect("/enter");await getServiceClient().from("swarm_members").update({bookmark_prompt_seen:true}).eq("id",member.id);redirect("/directory")}
