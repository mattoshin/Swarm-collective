import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceClient } from "./supabase";

export interface NewsItem {
  category: string;
  headline: string;
  summary: string;
  source_url: string;
}

export interface NewsDigest {
  digestDate: string;
  items: NewsItem[];
}

const AUDIENCE_PROMPT = `You write the daily news digest for Swarm Collective, a private community of AI-native young professionals: people shipping AI products, building agents, and evaluating new AI tools for their companies. They are NOT beginners and do not want generic "AI is changing the world" coverage.

Search the web for what actually happened in AI in the last 24-48 hours. Prioritize: new model releases, new developer tools and agent frameworks, notable outages or incidents at AI labs, and concrete product launches builders would want to try. Skip pure opinion pieces, generic listicles, and stock-market commentary.

After researching, respond with ONLY a raw JSON array, no markdown fences, no prose before or after. Return 5 to 8 items. Each item is an object with exactly these string fields:
- "category": a short label like "Models", "Tools", "Agents", "Industry", or "Policy"
- "headline": under 12 words, specific, no clickbait
- "summary": 2 to 3 sentences, concrete details (names, numbers, what changed)
- "source_url": the real URL you found this from

Order items by how relevant they are to a builder shipping AI products today.`;

export async function generateDailyDigest(): Promise<NewsItem[]> {
  const client = new Anthropic({ apiKey: requireApiKey() });

  const response = await client.messages.create(
    {
      model: "claude-sonnet-5",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
      messages: [{ role: "user", content: AUDIENCE_PROMPT }],
    },
    { timeout: 100_000, maxRetries: 1 },
  );

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  const jsonText = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
  const parsed: unknown = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) throw new Error("Digest response was not a JSON array.");

  return parsed
    .filter(
      (item): item is NewsItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as NewsItem).headline === "string" &&
        typeof (item as NewsItem).summary === "string",
    )
    .slice(0, 8)
    .map((item) => ({
      category: item.category || "News",
      headline: item.headline,
      summary: item.summary,
      source_url: item.source_url || "",
    }));
}

function requireApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY environment variable.");
  return key;
}

export async function saveDigest(digestDate: string, items: NewsItem[]): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("swarm_news_digest")
    .upsert({ digest_date: digestDate, items }, { onConflict: "digest_date" });
  if (error) throw error;
}

export async function listDigests(limit = 30): Promise<NewsDigest[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_news_digest")
    .select("digest_date,items")
    .order("digest_date", { ascending: false })
    .limit(limit);
  if (error) throw error;

  return ((data as { digest_date: string; items: NewsItem[] }[] | null) ?? []).map((row) => ({
    digestDate: row.digest_date,
    items: row.items,
  }));
}
