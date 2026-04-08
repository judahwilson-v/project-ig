import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

type NewsSource = {
  id: string;
  name: string;
  rss_url: string;
  language: string;
  region: string;
  is_active: boolean;
};

type FeedItem = {
  headline: string;
  summary: string;
  url: string;
  publishedAt: string;
};

function hashSource(text: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRssItems(xml: string): FeedItem[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return itemMatches.slice(0, 6).map((match) => {
    const item = match[1];
    const headline = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Untitled";
    const summary = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
    const url = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
    const publishedAt = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? new Date().toUTCString();

    return {
      headline: stripHtml(headline),
      summary: stripHtml(summary),
      url: stripHtml(url),
      publishedAt: new Date(publishedAt).toISOString()
    };
  });
}

async function runSentimentPass(apiKey: string, source: NewsSource, items: FeedItem[]) {
  const prompt = `
You are scoring Kerala political news for a youth-facing dashboard.
Return valid JSON with this shape:
{
  "region": "Malabar|Central Kerala|South Kerala|Kerala",
  "mood_score": 0-100,
  "unemployment_stress": 0-100,
  "political_sentiment": 0-100,
  "top_issue": "string",
  "summary_insight": "one sentence under 180 chars",
  "items": [
    {
      "headline": "string",
      "topic": "jobs|inflation|migration|election|governance",
      "sentiment_score": 0-1,
      "summary": "string under 180 chars"
    }
  ]
}

Source: ${source.name}
Feed:
${items.map((item, index) => `${index + 1}. ${item.headline} | ${item.summary}`).join("\n")}
`.trim();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-5.4",
      input: prompt
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const payload = await response.json();
  const text = payload.output_text ?? payload.output?.[0]?.content?.[0]?.text ?? "";

  return JSON.parse(text);
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const openAiKey = Deno.env.get("OPENAI_API_KEY");

  if (!supabaseUrl || !serviceRoleKey || !openAiKey) {
    return new Response(JSON.stringify({ error: "Missing required environment variables." }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: sources, error: sourceError } = await supabase
    .from("news_sources")
    .select("*")
    .eq("is_active", true);

  if (sourceError || !sources) {
    return new Response(JSON.stringify({ error: sourceError?.message ?? "Could not load sources." }), {
      status: 500
    });
  }

  const processed = [];

  for (const source of sources as NewsSource[]) {
    try {
      const rssResponse = await fetch(source.rss_url);
      const xml = await rssResponse.text();
      const feedItems = parseRssItems(xml);

      if (feedItems.length === 0) {
        continue;
      }

      const analysis = await runSentimentPass(openAiKey, source, feedItems);

      for (const [index, item] of feedItems.entries()) {
        const scoredItem = analysis.items[index];
        const sourceHash = await hashSource(`${source.id}:${item.url}:${item.headline}`);

        await supabase.from("news_items").upsert(
          {
            source_id: source.id,
            headline: item.headline,
            summary: scoredItem?.summary ?? item.summary,
            region: analysis.region ?? source.region,
            topic: scoredItem?.topic ?? "governance",
            sentiment_score: scoredItem?.sentiment_score ?? 0.5,
            published_at: item.publishedAt,
            source_hash: sourceHash,
            url: item.url
          },
          { onConflict: "source_hash" }
        );
      }

      await supabase.from("sentiment_pulse").upsert(
        {
          region: analysis.region ?? source.region,
          youth_mood_score: analysis.mood_score,
          unemployment_stress: analysis.unemployment_stress,
          top_issue: analysis.top_issue,
          political_sentiment: analysis.political_sentiment
        },
        { onConflict: "region" }
      );

      const insightHash = await hashSource(`${source.id}:${analysis.summary_insight}`);

      await supabase.from("insights").upsert(
        {
          category: "politics",
          title: `${source.name}: ${analysis.summary_insight}`,
          short_summary: analysis.summary_insight,
          full_summary: analysis.summary_insight,
          vector_summary: analysis.summary_insight,
          why_it_matters: "Political temperature affects job confidence, migration timing, and private investment mood.",
          read_more: "Open the politics route to track regional heat and issue shifts.",
          source_name: source.name,
          source_url: source.rss_url,
          source_trace: [source.name, analysis.top_issue],
          source_hash: insightHash,
          region: analysis.region ?? source.region,
          confidence_score: 0.72,
          trending_score: 70,
          metric_snapshot: {
            label: "Political temperature",
            value: `${analysis.political_sentiment}/100`,
            delta: analysis.top_issue
          }
        },
        { onConflict: "source_hash" }
      );

      processed.push(source.name);
    } catch (error) {
      console.error(`Failed to process ${source.name}:`, error);
    }
  }

  return new Response(JSON.stringify({ ok: true, processed }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});
