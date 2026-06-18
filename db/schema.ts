import {
  pgTable,
  serial,
  text,
  integer,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// Buyer personas the content engine targets. Mirrors the PERSONAS constant in the app.
export const personas = pgTable("personas", {
  id: integer().primaryKey(),
  name: text().notNull(),
  short: text(),
  tag: text(),
  emoji: text(),
  color: text(),
  angle: text(),
  avatar: text(),
  compliance: text(),
  length: text(),
  created_at: timestamp("created_at").defaultNow(),
});

// Products the platform generates content for (e.g. Lipitrex Water Pills).
export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  asin: text(),
  brand: text(),
  ingredients: text(),
  description: text(),
  created_at: timestamp("created_at").defaultNow(),
});

// Every generated post package. Primary key is the human-readable content ID
// (e.g. "LT-V-001-P1-0611") produced by the app.
export const content_posts = pgTable("content_posts", {
  id: text().primaryKey(),
  persona_id: integer("persona_id"),
  content_type: text("content_type"),
  format_id: text("format_id"),
  format_label: text("format_label"),
  offset_week: integer("offset_week"),
  platform: text(),
  hook: text(),
  caption: text(),
  full_output: text("full_output"),
  created_at: timestamp("created_at").defaultNow(),
});

// Lifecycle stage transitions for a post (Organic, Paid, Evergreen, ...).
export const genome_events = pgTable("genome_events", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  stage: text().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Performance metrics captured per post (views, saves, hold/view rates, etc.).
export const content_metrics = pgTable("content_metrics", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  persona_id: integer("persona_id"),
  format_id: text("format_id"),
  content_type: text("content_type"),
  views: integer(),
  saves: integer(),
  comments: integer(),
  completion: real(),
  hold_2s: real("hold_2s"),
  view_6s: real("view_6s"),
  created_at: timestamp("created_at").defaultNow(),
});

// Carousel slide images produced by PostNitro for a post.
export const carousel_outputs = pgTable("carousel_outputs", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  persona_id: integer("persona_id"),
  embed_post_id: text("embed_post_id"),
  image_urls: jsonb("image_urls"),
  status: text(),
  created_at: timestamp("created_at").defaultNow(),
});

// HeyGen video renders produced for a post. One row per completed video.
export const video_outputs = pgTable("video_outputs", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  persona_id: integer("persona_id"),
  video_id: text("video_id"),
  video_url: text("video_url"),
  generated_at: timestamp("generated_at").defaultNow(),
});

// Attribute tags attached to a post (key/value pairs surfaced in the Genome tab).
export const content_tags = pgTable("content_tags", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  key: text().notNull(),
  value: text(),
  created_at: timestamp("created_at").defaultNow(),
});

// Landing-page signals emitted when winning content reaches the Templated stage.
export const landing_page_signals = pgTable("landing_page_signals", {
  id: serial().primaryKey(),
  post_id: text("post_id").references(() => content_posts.id),
  format_id: text("format_id"),
  element: text(),
  description: text(),
  created_at: timestamp("created_at").defaultNow(),
});
