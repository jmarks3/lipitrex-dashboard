import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { carousel_outputs, content_posts, genome_events, video_outputs } from "../../db/schema.js";

// Data API backing the dashboard. Replaces the former direct Supabase client.
//   GET  /api/content            -> { posts, events, carousels, videos }
//   POST /api/content  (post)     -> insert a generated content package
//   POST /api/content  (event)    -> append a lifecycle stage transition
//   POST /api/content  (carousel) -> store PostNitro carousel slide images
//   POST /api/content  (video)    -> store a completed HeyGen video render
export default async (req: Request) => {
  try {
    if (req.method === "GET") {
      const [posts, events, carousels, videos] = await Promise.all([
        db.select().from(content_posts).orderBy(desc(content_posts.created_at)),
        db.select().from(genome_events).orderBy(desc(genome_events.created_at)),
        db.select().from(carousel_outputs).orderBy(desc(carousel_outputs.created_at)),
        db.select().from(video_outputs).orderBy(desc(video_outputs.generated_at)),
      ]);
      return Response.json({ posts, events, carousels, videos });
    }

    if (req.method === "POST") {
      const body = await req.json();

      if (body.kind === "post") {
        const [row] = await db
          .insert(content_posts)
          .values({
            id: body.id,
            persona_id: body.persona_id,
            content_type: body.content_type,
            format_id: body.format_id,
            format_label: body.format_label,
            offset_week: body.offset_week,
            platform: body.platform,
            hook: body.hook,
            caption: body.caption,
            full_output: body.full_output,
          })
          .returning();
        return Response.json(row, { status: 201 });
      }

      if (body.kind === "event") {
        const [row] = await db
          .insert(genome_events)
          .values({ post_id: body.post_id, stage: body.stage })
          .returning();
        return Response.json(row, { status: 201 });
      }

      if (body.kind === "carousel") {
        const image_urls = [
          body.slide_1_url,
          body.slide_2_url,
          body.slide_3_url,
        ].filter(Boolean);
        const [row] = await db
          .insert(carousel_outputs)
          .values({
            post_id: body.post_id,
            persona_id: body.persona_id,
            embed_post_id: body.embed_post_id,
            image_urls,
            status: "COMPLETED",
            created_at: body.generated_at ? new Date(body.generated_at) : undefined,
          })
          .returning();
        return Response.json(row, { status: 201 });
      }

      if (body.kind === "video") {
        const [row] = await db
          .insert(video_outputs)
          .values({
            post_id: body.post_id,
            persona_id: body.persona_id,
            video_id: body.video_id,
            video_url: body.video_url,
            generated_at: body.generated_at ? new Date(body.generated_at) : undefined,
          })
          .returning();
        return Response.json(row, { status: 201 });
      }

      return Response.json({ error: "Unknown kind" }, { status: 400 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 },
    );
  }
};

export const config: Config = {
  path: "/api/content",
};
