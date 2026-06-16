import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { content_posts, genome_events } from "../../db/schema.js";

// Data API backing the dashboard. Replaces the former direct Supabase client.
//   GET  /api/content            -> { posts, events }
//   POST /api/content  (post)    -> insert a generated content package
//   POST /api/content  (event)   -> append a lifecycle stage transition
export default async (req: Request) => {
  try {
    if (req.method === "GET") {
      const [posts, events] = await Promise.all([
        db.select().from(content_posts).orderBy(desc(content_posts.created_at)),
        db.select().from(genome_events).orderBy(desc(genome_events.created_at)),
      ]);
      return Response.json({ posts, events });
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
