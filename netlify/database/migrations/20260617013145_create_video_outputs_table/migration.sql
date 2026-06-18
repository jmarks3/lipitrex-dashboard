CREATE TABLE "video_outputs" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"persona_id" integer,
	"video_id" text,
	"video_url" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "video_outputs" ADD CONSTRAINT "video_outputs_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");