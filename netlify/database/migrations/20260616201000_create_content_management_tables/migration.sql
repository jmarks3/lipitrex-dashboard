CREATE TABLE "carousel_outputs" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"persona_id" integer,
	"embed_post_id" text,
	"image_urls" jsonb,
	"status" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_metrics" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"persona_id" integer,
	"format_id" text,
	"content_type" text,
	"views" integer,
	"saves" integer,
	"comments" integer,
	"completion" real,
	"hold_2s" real,
	"view_6s" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_posts" (
	"id" text PRIMARY KEY,
	"persona_id" integer,
	"content_type" text,
	"format_id" text,
	"format_label" text,
	"offset_week" integer,
	"platform" text,
	"hook" text,
	"caption" text,
	"full_output" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_tags" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"key" text NOT NULL,
	"value" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "genome_events" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"stage" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "landing_page_signals" (
	"id" serial PRIMARY KEY,
	"post_id" text,
	"format_id" text,
	"element" text,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "personas" (
	"id" integer PRIMARY KEY,
	"name" text NOT NULL,
	"short" text,
	"tag" text,
	"emoji" text,
	"color" text,
	"angle" text,
	"avatar" text,
	"compliance" text,
	"length" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"asin" text,
	"brand" text,
	"ingredients" text,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "carousel_outputs" ADD CONSTRAINT "carousel_outputs_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");--> statement-breakpoint
ALTER TABLE "content_metrics" ADD CONSTRAINT "content_metrics_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");--> statement-breakpoint
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");--> statement-breakpoint
ALTER TABLE "genome_events" ADD CONSTRAINT "genome_events_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");--> statement-breakpoint
ALTER TABLE "landing_page_signals" ADD CONSTRAINT "landing_page_signals_post_id_content_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id");