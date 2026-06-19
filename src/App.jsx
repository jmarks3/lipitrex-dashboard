import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────
const T = {
  white: "#ffffff",
  bg: "#f4f5f7",
  card: "#ffffff",
  border: "#e8eaed",
  borderStrong: "#d1d5db",
  gold: "#b8922a",
  goldLight: "#f5e6c8",
  goldDark: "#8a6a10",
  ink: "#111827",
  body: "#374151",
  muted: "#6b7280",
  subtle: "#9ca3af",
  faint: "#f9fafb",
  green: "#10b981",
  greenLight: "#d1fae5",
  red: "#ef4444",
  redLight: "#fee2e2",
  blue: "#3b82f6",
  blueLight: "#dbeafe",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)",
  radius: "12px",
  radiusSm: "8px",
  radiusXs: "6px",
};

// ─── DATA ────────────────────────────────────────────────
const PERSONAS = [
  {
    id: 1, name: "Seniors", emoji: "☀️", short: "Seniors",
    tag: "Adults 55+ / Venous Insufficiency", color: "#b8922a", light: "#fef3c7",
    painPoints: ["Shoes fit at 9am, won't fit by 3pm", "Heavy legs by afternoon", "Doctors just say 'elevate your legs'"],
    angle: "Horse Chestnut for vein support · Made in the USA",
    avatar: "Woman 60–65, silver hair, kitchen table, morning light, warm and unhurried",
    compliance: "No medical claims. Warm, reassuring tone.",
    length: "45–55 sec",
  },
  {
    id: 2, name: "Weight-Related", emoji: "🌱", short: "Weight",
    tag: "Weight-Related Swelling", color: "#059669", light: "#d1fae5",
    painPoints: ["Sock marks visible by end of day", "Swelling discourages movement", "Tried everything, still searching"],
    angle: "Dandelion leaf for natural fluid balance · Gentle, plant-based",
    avatar: "Woman or man 35–50, everyday casual, kitchen or living room, real not polished",
    compliance: "Zero shame language. Solution-forward only.",
    length: "30 sec",
  },
  {
    id: 3, name: "Hormonal", emoji: "🌸", short: "Hormonal",
    tag: "Perimenopausal / Menopausal 40–55+", color: "#db2777", light: "#fce7f3",
    painPoints: ["Monthly hormonal swelling cycles", "Rings don't fit, bloating diet doesn't fix", "Dismissed — told labs are normal"],
    angle: "All-botanical formula · Plant-based, no harsh chemicals",
    avatar: "Woman 42–55, relatable everyday appearance, home setting, warm and direct",
    compliance: "No pregnancy content. Focus on perimenopausal and menopausal fluid retention only.",
    length: "30 sec",
  },
  {
    id: 4, name: "Nine-to-Five", emoji: "👟", short: "9-to-5",
    tag: "Workers / Standing & Sitting Jobs", color: "#2563eb", light: "#dbeafe",
    painPoints: ["Dead-leg after long shifts", "Travel and desk swelling", "No time for complex routines"],
    angle: "Simple daily capsule · Ginkgo for clarity · Works while you work",
    avatar: "Woman 30–45 in scrubs or uniform, break room or post-shift, fast and direct",
    compliance: "No medical claims. Practical, no-nonsense tone.",
    length: "30 sec",
  },
  {
    id: 5, name: "Rx Side Effects", emoji: "💊", short: "Rx",
    tag: "Medication-Induced Fluid Retention", color: "#7c3aed", light: "#ede9fe",
    painPoints: ["Need the meds but hate the swelling", "Swelling started with the prescription", "Doctors acknowledge it but don't help"],
    angle: "Natural botanical complement · Buchu + Uva Ursi support fluid balance",
    avatar: "Man or woman 45–60, direct to camera, home office, matter-of-fact, validates first",
    compliance: "Must include: Consult your prescribing doctor before adding supplements.",
    length: "45–55 sec",
  },
];

const VIDEO_FORMATS = [
  { id: "edu", label: "Educational", emoji: "📚", day: "Mon", metric: "Save rate", desc: "Teach something useful. Hook with a surprising fact, explain plainly, tie in product naturally." },
  { id: "story", label: "Testimonial", emoji: "🎤", day: "Tue", metric: "Comment sentiment", desc: "Real-feeling before/after story. Specific details, authentic first-person voice." },
  { id: "hook", label: "Hook & Reveal", emoji: "⚡", day: "Wed", metric: "Completion rate", desc: "Bold unexpected opener, build tension, pay it off. Every word earns its place." },
  { id: "pov", label: "POV / Day-in-Life", emoji: "🎥", day: "Thu", metric: "Watch time", desc: "Put the viewer inside the persona's day. Present-tense, immersive, specific moments." },
  { id: "trend", label: "Trend / Sound", emoji: "🎵", day: "Fri", metric: "Shares", desc: "Ride a current TikTok format or audio. Native to the platform, doesn't feel like an ad." },
];

const CAROUSEL_FORMATS = [
  { id: "myth", label: "Myth vs Fact", emoji: "🔍", day: "Mon", metric: "Save rate", desc: "Bust common edema misconceptions. People screenshot and share myth-busting content." },
  { id: "ingredient", label: "Ingredient", emoji: "🌿", day: "Tue", metric: "Profile visits", desc: "One ingredient per carousel. Dandelion, Horse Chestnut, Ginkgo, Uva Ursi, Buchu." },
  { id: "checklist", label: "Checklist", emoji: "✅", day: "Wed", metric: "Bookmarks", desc: "Persona-specific lifestyle checklist. Highest bookmark rate. Lipitrex only on final slide." },
  { id: "before_after", label: "Before & After", emoji: "📖", day: "Thu", metric: "Pipeline transfer", desc: "Social proof in slide format. Specific details make it feel real. High video transfer potential." },
  { id: "quiz", label: "Quiz / Did You Know", emoji: "🧠", day: "Fri", metric: "Comments", desc: "Interactive-feeling content drives saves and comments. One question per slide." },
];

const VIDEO_ROTATION = {
  1: { 1: "edu", 2: "story", 3: "hook", 4: "pov", 5: "trend" },
  2: { 1: "story", 2: "hook", 3: "pov", 4: "trend", 5: "edu" },
  3: { 1: "hook", 2: "pov", 3: "trend", 4: "edu", 5: "story" },
  4: { 1: "pov", 2: "trend", 3: "edu", 4: "story", 5: "hook" },
  5: { 1: "trend", 2: "edu", 3: "story", 4: "hook", 5: "pov" },
};

const CAROUSEL_ROTATION = {
  1: { 1: "myth", 2: "ingredient", 3: "checklist", 4: "before_after", 5: "quiz" },
  2: { 1: "ingredient", 2: "checklist", 3: "before_after", 4: "quiz", 5: "myth" },
  3: { 1: "checklist", 2: "before_after", 3: "quiz", 4: "myth", 5: "ingredient" },
  4: { 1: "before_after", 2: "quiz", 3: "myth", 4: "ingredient", 5: "checklist" },
  5: { 1: "quiz", 2: "myth", 3: "ingredient", 4: "before_after", 5: "checklist" },
};

const CONTENT_STAGES = ["Organic", "Paid", "Evergreen", "Cross-Platform", "Repurposed", "Templated", "Retired"];

const LANDING_PAGE_MAP = {
  hook: { element: "Above the Fold Headline", desc: "The hook that stopped the scroll becomes the headline that stops the browser scroll." },
  story: { element: "Testimonial Section", desc: "The Before & After arc that resonates becomes the testimonial template and featured review structure." },
  hook_reveal: { element: "Above the Fold Headline", desc: "Bold opening framing translates directly to the primary headline on the listing." },
  pov: { element: "Bullet Points", desc: "The day-in-life pain points that generate comment sentiment become the primary bullet points." },
  edu: { element: "A+ Content", desc: "Educational structure that gets saved becomes the product detail and A+ content module." },
  myth: { element: "FAQ Section", desc: "Myth vs Fact structure translates to an FAQ or myth-busting section on the listing." },
  ingredient: { element: "A+ Content Modules", desc: "The ingredient spotlight that gets bookmarked most becomes the A+ content structure." },
  checklist: { element: "Bullet Points", desc: "The checklist items that get saved become the product listing bullet points — in the buyer's own language." },
  before_after: { element: "Testimonial + Social Proof", desc: "The story arc that converts becomes the testimonial template and review highlight section." },
  quiz: { element: "FAQ / Education Section", desc: "Questions that drive saves reveal what buyers need to understand before purchasing." },
};

const SYSTEM_PROMPT = (persona, format, type, week) => `You are an expert TikTok content strategist and certified health supplement marketer for Lipitrex Water Pills by Harvest Vitality — a botanical supplement sold on Amazon (ASIN: B08B9SH5XH) containing Dandelion Leaf, Horse Chestnut, Ginkgo Biloba, Uva Ursi, and Buchu Leaf. GMP certified, FDA registered, made in the USA.

BAIT AND ANCHOR MODEL:
- Videos are the BAIT — reach new people, stop the scroll, create first impression
- Carousels are the ANCHOR — build trust with warm audience, reinforce the message, convert curious viewers into confident buyers
- Every carousel primary objective: reinforce brand message and deepen trust. Not to sell — to make them trust Lipitrex enough to buy.

CONTENT RULE: Solution-forward and empowering always. No doom, no shame, no fear. Lead with empathy, land on possibility. NO pregnancy content ever.

VIDEO LENGTH TARGETS (data-backed):
- Hook & Reveal: 11–15 seconds (loopable, highest completion and replay rate)
- Testimonial / POV: 30 seconds (story arc sweet spot)
- Educational: 45–55 seconds (value justifies length)
- Trend/Sound: 15–20 seconds (native platform behavior)
Scripts must be tight. If a word can be cut, cut it.

COMPLIANCE — Structure/function claims only:
✅ SAFE: "supports healthy fluid balance," "promotes healthy circulation," "traditionally used to support fluid balance"
❌ NEVER: "treats," "cures," "prevents" edema or any disease

AVATAR MATCHING — Non-negotiable. Every video must feature a character who demographically mirrors the target persona:
${persona.avatar}
Pacing must also match: ${persona.id === 1 ? 'slow, deliberate, trust-building' : persona.id === 2 ? 'conversational, no performance, zero shame' : persona.id === 3 ? 'warm, direct, been-through-it energy' : persona.id === 4 ? 'fast, direct, no time to waste' : 'straight talk, validate the frustration first'}

HEYGEN PRODUCTION: All video direction formatted for HeyGen production. Include exact avatar type, scene, text overlay timing, and audio mood so the operator can produce without interpretation.

Generate a complete ${type === 'video' ? 'TikTok VIDEO' : 'CAROUSEL'} post package. Use these exact headers:

## CONTENT ID
Format: LT-${type === 'video' ? 'V' : 'C'}-[###]-P${persona.id}-${new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit'}).replace('/','')}}
List all attribute tags: content type, persona, format, hook type, pain point, ingredient, CTA level, avatar age, emotional tone, compliance, platform, offset, pipeline rating.

## HOOK
One line. Stops the scroll. ${type === 'video' ? `Spoken aloud in first 2 seconds. Target length: ${persona.length}` : 'Bold text on slide 1.'}

## ${type === 'video' ? 'SCRIPT' : 'SLIDE BREAKDOWN'}
${type === 'video' ? `Full script timed to ${persona.length}. Format: [HOOK 0-3s] [BODY] [CTA — soft/medium/hard options]` : '3 slides maximum. Every slide: number, headline text, body text (1-2 sentences max), HeyGen visual direction. Slide 1: hook. Slide 2: education/value. Slide 3: CTA with soft product mention.'}

## HEYGEN ${type === 'video' ? 'VIDEO' : 'IMAGE'} BRIEF
${type === 'video' ? 'Avatar selection (age, appearance, energy), scene, setting, wardrobe, delivery pace, b-roll, text overlay timing, audio mood' : 'Visual style, color palette, typography, slide layout, brand consistency for HeyGen image generation'}

## CAPTION
Under ${type === 'video' ? '150' : '100'} words. ${type === 'carousel' ? "Opens with trust message. Soft CTA: 'Save this' or 'Link in bio.'" : 'Opens strong, delivers value, Amazon CTA.'} Hashtags at end.

## HASHTAGS
5 high-volume | 5 niche | 3 experimental 🧪

## COMPLIANCE CHECK
Full checklist. ${persona.id === 5 ? `⚠️ Required disclaimer: ${persona.compliance}` : 'No disclaimer required for this persona.'}

## PIPELINE NOTE
${type === 'carousel' ? 'Rate video transfer potential: High / Medium / Low — why, and what the video version would look like.' : 'Rate paid ad potential: High / Medium / Low — which attributes drove performance.'}

## STAGE RECOMMENDATION
Recommend first stage transition: Paid / Evergreen / Cross-Platform / Repurpose candidate`;

// ─── COMPONENTS ─────────────────────────────────────────

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.card, borderRadius: T.radius, border: `1px solid ${T.border}`,
    boxShadow: T.shadow, padding: "20px", ...style,
    cursor: onClick ? "pointer" : "default",
    transition: "box-shadow 0.15s",
  }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = T.shadowMd)}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = T.shadow)}
  >
    {children}
  </div>
);

const Badge = ({ children, color = T.gold, bg = T.goldLight }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "4px",
    background: bg, color, borderRadius: "20px",
    padding: "2px 10px", fontSize: "11px", fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const styles = {
    primary: { background: T.gold, color: T.white, border: "none" },
    secondary: { background: T.white, color: T.ink, border: `1px solid ${T.border}` },
    ghost: { background: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger: { background: T.redLight, color: T.red, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], borderRadius: T.radiusSm, padding: "8px 16px",
      fontSize: "13px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, transition: "all 0.15s", ...style,
    }}>{children}</button>
  );
};

const Label = ({ children }) => (
  <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, style = {} }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{
      width: "100%", padding: "8px 12px", borderRadius: T.radiusXs,
      border: `1px solid ${T.border}`, fontSize: "13px", color: T.ink,
      background: T.white, boxSizing: "border-box", outline: "none",
      fontFamily: "inherit", ...style,
    }} />
);

const Stat = ({ label, value, sub, color = T.gold }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "12px", fontWeight: 600, color: T.ink, marginTop: "4px" }}>{label}</div>
    {sub && <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>{sub}</div>}
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────

export default function LipitrexDashboard() {
  const [tab, setTab] = useState("generate");
  const [genType, setGenType] = useState("video");
  const ANCHOR = new Date("2026-05-12");
  const today = new Date();
  const weeksElapsed = Math.floor((today - ANCHOR) / (7 * 24 * 60 * 60 * 1000));
  const currentOffset = (weeksElapsed % 5) + 1;
  const week = currentOffset;
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [contentLog, setContentLog] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const [heygenKey, setHeygenKey] = useState("");
  const [heygenConnected, setHeygenConnected] = useState(true);
  const [heygenStatus, setHeygenStatus] = useState({});
  const [postnitroStatus, setPostnitroStatus] = useState({});
const [postnitroOutputs, setPostnitroOutputs] = useState({});
  const [heygenOutputs, setHeygenOutputs] = useState({});
  const [videoMetrics, setVideoMetrics] = useState(() => {
    const m = {};
    VIDEO_FORMATS.forEach(f => { m[f.id] = {}; PERSONAS.forEach(p => { m[f.id][p.id] = { views: "", saves: "", comments: "", completion: "", hold_2s: "", view_6s: "" }; }); });
    return m;
  });
  const [carouselMetrics, setCarouselMetrics] = useState(() => {
    const m = {};
    CAROUSEL_FORMATS.forEach(f => { m[f.id] = {}; PERSONAS.forEach(p => { m[f.id][p.id] = { views: "", saves: "", comments: "", completion: "", hold_2s: "", view_6s: "" }; }); });
    return m;
  });
  const [trackType, setTrackType] = useState("video");
  const [trackFormat, setTrackFormat] = useState(VIDEO_FORMATS[0].id);
  const [genomeDateRange, setGenomeDateRange] = useState("all");
  const [genomePersona, setGenomePersona] = useState("all");
  const [genomeType, setGenomeType] = useState("all");
  const [genomeFormat, setGenomeFormat] = useState("all");
  const [genomeStage, setGenomeStage] = useState("all");
  const [genomeExpanded, setGenomeExpanded] = useState(null);
  const [genomeOutputs, setGenomeOutputs] = useState({});
  const [genomeFetching, setGenomeFetching] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  const ALL_FORMATS = [...VIDEO_FORMATS, ...CAROUSEL_FORMATS];

  // Copy text to clipboard and flash a "✓ Copied!" confirmation on the button
  // identified by `key` for 2 seconds before reverting.
  const copyWithFeedback = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => (prev === key ? null : prev));
    }, 2000);
  };

  // Trigger a browser download of `content` as a file named `filename`.
  const downloadFile = (filename, content, mime = "text/plain") => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Escape a single value for safe inclusion in a CSV cell.
  const csvCell = (value) => {
    const s = value == null ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  // Build and download a CSV export of the currently filtered Genome content.
  const downloadGenomeResults = () => {
    const headers = ["Content ID", "Date", "Persona", "Content Type", "Format", "Offset", "Platform", "Stage", "Hook", "Caption"];
    const rows = genomeFiltered.map(item => [
      item.id,
      item.date,
      item.persona,
      item.type,
      item.format,
      `${item.offset}/5`,
      item.attributes?.platform || "TikTok",
      item.stage,
      item.hook || "",
      item.caption || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(csvCell).join(",")).join("\r\n");
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    downloadFile(`Lipitrex-Content-Export-${today}.csv`, csv, "text/csv");
  };

  // Shared style for the Genome filter-bar dropdowns.
  const genomeSelectStyle = {
    padding: "7px 10px", borderRadius: T.radiusXs,
    border: `1px solid ${T.border}`, fontSize: "12px", fontWeight: 600,
    color: T.body, background: T.white, cursor: "pointer",
    fontFamily: "inherit", outline: "none",
  };

  // Apply the Genome tab filter bar selections to the content log.
  const genomeFiltered = contentLog.filter(item => {
    if (genomePersona !== "all" && item.persona !== genomePersona) return false;
    if (genomeType !== "all" && item.type !== genomeType) return false;
    if (genomeFormat !== "all" && item.format !== genomeFormat) return false;
    if (genomeStage !== "all" && item.stage !== genomeStage) return false;
    if (genomeDateRange !== "all") {
      let cutoff;
      if (genomeDateRange === "today") {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        cutoff = d.getTime();
      } else {
        const days = genomeDateRange === "7" ? 7 : 30;
        cutoff = Date.now() - days * 86400000;
      }
      if (!(item.ts >= cutoff)) return false;
    }
    return true;
  });

  // Build a contentLog entry (with all derived display fields) from core attributes.
  const buildEntry = ({ id, persona, format, type, offset, stage, date, ts, fullOutput, hook, caption }) => ({
    id,
    persona: persona.name,
    personaId: persona.id,
    personaColor: persona.color,
    personaEmoji: persona.emoji,
    format: format.label,
    formatEmoji: format.emoji,
    type,
    offset,
    stage,
    date,
    ts: ts ?? Date.now(),
    fullOutput: fullOutput ?? null,
    hook: hook ?? (fullOutput ? extractSection(fullOutput, "HOOK") : ""),
    caption: caption ?? (fullOutput ? extractSection(fullOutput, "CAPTION") : ""),
    attributes: {
      contentType: type,
      persona: persona.name,
      format: format.label,
      metric: format.metric,
      length: persona.length,
      compliance: persona.id === 5 ? "Required" : "None",
      offset: `${offset}/5`,
      platform: "TikTok",
    },
  });

  // Extract a markdown section (e.g. HOOK, CAPTION) from generated output.
  const extractSection = (text, header) => {
    const re = new RegExp(`##\\s*${header}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
    const m = text.match(re);
    return m ? m[1].trim() : "";
  };

  // Pull only the words the avatar should speak out of the ## SCRIPT section.
  // The raw section is loaded with production directions ([HOOK 0-3s], [BODY],
  // [CTA — soft/medium/hard]), timestamps, bold markers, and soft/medium/hard
  // CTA variants. HeyGen needs clean spoken dialogue, so strip all of that and
  // keep only the MEDIUM CTA option among the soft/medium/hard choices.
  const extractSpokenScript = (text) => {
    // 1. Isolate the ## SCRIPT section (up to the next ## heading).
    const section = extractSection(text, "SCRIPT");
    const raw = section || text;

    const lines = raw.split("\n");
    const cleaned = [];
    // Tracks which CTA variant we're inside so only MEDIUM survives.
    let ctaMode = null; // null | "keep" | "drop"

    for (let line of lines) {
      // 6. Drop markdown list/quote lines.
      if (/^\s*\*/.test(line)) continue;

      line = line.replace(/^\s*>\s*/, "");

      // 5. Detect soft/medium/hard CTA labels and keep only MEDIUM's text.
      const labelMatch = line.match(/^\s*\**\s*(SOFT|MEDIUM|HARD)\s*\**\s*:?\s*/i);
      if (labelMatch) {
        const label = labelMatch[1].toUpperCase();
        ctaMode = label === "MEDIUM" ? "keep" : "drop";
        // Remove the label itself, keep any trailing inline text on the line.
        line = line.slice(labelMatch[0].length);
        if (ctaMode === "drop") continue;
        if (!line.trim()) continue;
      } else if (ctaMode === "drop") {
        // Continuation lines belong to the SOFT/HARD block we're skipping.
        if (!line.trim()) { ctaMode = null; }
        continue;
      }

      let cleanedLine = line
        // 2. Remove bracketed direction notes like [HOOK 0-3s], [CTA — soft].
        .replace(/\[[^\]]*\]/g, "")
        // 3. Remove timestamp markers like 0–4s, 4-38s (en-dash or hyphen).
        .replace(/\b\d+\s*[–-]\s*\d+\s*s\b/gi, "")
        // 4. Remove bold/emphasis markers.
        .replace(/\*\*/g, "")
        // 7. Strip any remaining markdown symbols.
        .replace(/[#*_>`~]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      if (cleanedLine) cleaned.push(cleanedLine);
    }

    // 8 & 9. Join into clean spoken dialogue, capped at HeyGen's 1500 chars.
    return cleaned.join(" ").replace(/\s{2,}/g, " ").trim().slice(0, 1500);
  };

  // Load existing content + latest lifecycle stage from Netlify DB on mount.
  useEffect(() => {
    const load = async () => {
      let posts, events, carousels, videos;
      try {
        const res = await fetch("/api/content");
        if (!res.ok) return;
        ({ posts, events, carousels, videos } = await res.json());
      } catch {
        return;
      }
      if (!posts) return;

      const sortedEvents = (events || []).slice().sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const latestStage = {};
      sortedEvents.forEach(e => {
        if (!(e.post_id in latestStage)) latestStage[e.post_id] = e.stage;
      });

      const sortedPosts = posts.slice().sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const entries = sortedPosts.map(row => {
        const persona = PERSONAS.find(p => p.id === row.persona_id) || PERSONAS[0];
        const format = ALL_FORMATS.find(f => f.id === row.format_id) || ALL_FORMATS[0];
        return buildEntry({
          id: row.id,
          persona,
          format,
          type: row.content_type,
          offset: row.offset_week,
          stage: latestStage[row.id] || "Organic",
          date: row.created_at ? new Date(row.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          ts: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          fullOutput: row.full_output ?? null,
          hook: row.hook ?? null,
          caption: row.caption ?? null,
        });
      });

      setContentLog(entries);
      setIdCounter(posts.length + 1);

      // Restore PostNitro carousel thumbnails. Keyed per persona (most recent
      // carousel wins) to mirror the postnitro_<personaId> state shape.
      const sortedCarousels = (carousels || []).slice().sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const restoredOutputs = {};
      sortedCarousels.forEach(row => {
        const key = `postnitro_${row.persona_id}`;
        if (!(key in restoredOutputs) && Array.isArray(row.image_urls) && row.image_urls.length) {
          restoredOutputs[key] = row.image_urls;
        }
      });
      if (Object.keys(restoredOutputs).length) setPostnitroOutputs(restoredOutputs);

      // Restore HeyGen video links. Keyed per persona ID (most recent render
      // wins) to mirror the heygenOutputs state shape.
      const sortedVideos = (videos || []).slice().sort(
        (a, b) => new Date(b.generated_at || 0) - new Date(a.generated_at || 0)
      );
      const restoredVideos = {};
      sortedVideos.forEach(row => {
        if (!(row.persona_id in restoredVideos) && row.video_url) {
          restoredVideos[row.persona_id] = row.video_url;
        }
      });
      if (Object.keys(restoredVideos).length) setHeygenOutputs(restoredVideos);
    };
    load();
  }, []);

  // Record a lifecycle stage transition: update locally and append to genome_events.
  const updateStage = async (id, stage) => {
    setContentLog(prev => prev.map(item => (item.id === id ? { ...item, stage } : item)));
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "event", post_id: id, stage }),
      });
    } catch (e) {
      // Non-blocking — the local UI already reflects the new stage.
    }
  };

  // Toggle a Genome content card open/closed. On open, lazily fetch full_output
  // from /api/content (matched by content ID) when it isn't already loaded.
  const toggleGenomeCard = async (item) => {
    if (genomeExpanded === item.id) {
      setGenomeExpanded(null);
      return;
    }
    setGenomeExpanded(item.id);

    if (item.fullOutput || genomeOutputs[item.id] !== undefined) return;

    setGenomeFetching(prev => ({ ...prev, [item.id]: true }));
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const { posts } = await res.json();
        const row = (posts || []).find(p => p.id === item.id);
        setGenomeOutputs(prev => ({ ...prev, [item.id]: row?.full_output || "" }));
      } else {
        setGenomeOutputs(prev => ({ ...prev, [item.id]: "" }));
      }
    } catch {
      setGenomeOutputs(prev => ({ ...prev, [item.id]: "" }));
    } finally {
      setGenomeFetching(prev => ({ ...prev, [item.id]: false }));
    }
  };


  const getOffsetDateRange = (offset) => {
    const weekStart = new Date(ANCHOR);
    weekStart.setDate(ANCHOR.getDate() + ((offset - 1 + Math.floor((today - ANCHOR) / (7 * 24 * 60 * 60 * 1000)) - ((Math.floor((today - ANCHOR) / (7 * 24 * 60 * 60 * 1000))) % 5)) * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4);
    return `${weekStart.toLocaleDateString('en-US', {month:'short', day:'numeric'})} – ${weekEnd.toLocaleDateString('en-US', {month:'short', day:'numeric'})}`;
  };

  const todayDay = new Date().getDay();
  const dayToIndex = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 0, 0: 0 };

  const getFormatForPersona = (personaId, type) => {
    const rotation = type === "video" ? VIDEO_ROTATION : CAROUSEL_ROTATION;
    const weekOffset = ((week - 1 + personaId - 1) % 5) + 1;
    const dayIndex = dayToIndex[todayDay];
    const formats = type === "video" ? VIDEO_FORMATS : CAROUSEL_FORMATS;
    const rotationForWeek = rotation[weekOffset];
    const formatId = Object.values(rotationForWeek)[dayIndex];
    return formats.find(f => f.id === formatId) || formats[0];
  };

  const getSaveRate = (metrics, fId, pId) => {
    const d = metrics[fId]?.[pId];
    if (!d?.views || !d?.saves) return null;
    return ((parseFloat(d.saves) / parseFloat(d.views)) * 100).toFixed(1);
  };

  const getSignalScore = (metrics, fId, pId) => {
    const d = metrics[fId]?.[pId];
    if (!d) return null;
    const hold = parseFloat(d.hold_2s) || 0;
    const view6 = parseFloat(d.view_6s) || 0;
    const save = d.views && d.saves ? (parseFloat(d.saves) / parseFloat(d.views)) * 100 : 0;
    if (!hold && !view6 && !save) return null;
    return ((hold * 0.3) + (view6 * 0.4) + (save * 0.3)).toFixed(1);
  };

  const generatePost = async (persona, type) => {
    const format = getFormatForPersona(persona.id, type);
    const key = `${type}_${persona.id}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    setResults(prev => ({ ...prev, [key]: "" }));

    const dateStr = new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit'}).replace('/','');
    const num = String(idCounter).padStart(3, "0");
    const newId = `LT-${type === 'video' ? 'V' : 'C'}-${num}-P${persona.id}-${dateStr}`;

    try {
      const res = await fetch("https://lipitrex-dashboard.vercel.app/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: SYSTEM_PROMPT(persona, format, type, week),
          messages: [{
            role: "user",
            content: `Generate a complete ${type} post package for:
PERSONA: ${persona.name} (${persona.tag})
FORMAT: ${format.label} — ${format.desc}
PAIN POINTS: ${persona.painPoints.join(" | ")}
LIPITREX ANGLE: ${persona.angle}
DATE: ${new Date().toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric', year:'numeric'})}
OFFSET: ${currentOffset} of 5
CONTENT ID: ${newId}
KEY METRIC: ${format.metric}
CONVERSION SIGNALS: Track 2-second hold rate (scroll-stop), 6-second view rate (algorithm signal), save rate (purchase intent). These outpredict likes and views for supplement category conversions.
VIDEO LENGTH TARGET: ${persona.length}

Make it specific, vivid, and warm. The viewer should feel understood before they feel sold to. No pregnancy content.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Error generating content.";
      setResults(prev => ({ ...prev, [key]: text }));

      const entry = buildEntry({
        id: newId,
        persona,
        format,
        type,
        offset: currentOffset,
        stage: "Organic",
        date: new Date().toLocaleDateString(),
        ts: Date.now(),
        fullOutput: text,
      });
      setContentLog(prev => [entry, ...prev]);
      setIdCounter(prev => prev + 1);

      // Persist the generated post to Netlify DB.
      try {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "post",
            id: newId,
            persona_id: persona.id,
            content_type: type,
            format_id: format.id,
            format_label: format.label,
            offset_week: currentOffset,
            platform: "TikTok",
            hook: extractSection(text, "HOOK"),
            caption: extractSection(text, "CAPTION"),
            full_output: text,
          }),
        });
      } catch (dbErr) {
        // Non-blocking — the post is already shown in the local content log.
      }

    } catch (e) {
      setResults(prev => ({ ...prev, [key]: "Error — please retry." }));
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const generateAll = async () => {
    for (const persona of PERSONAS) {
      generatePost(persona, genType);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  const sendToHeyGen = async (e, persona, result, genomeId) => {
    e.stopPropagation();
    const key = `heygen_${persona.id}`;
    setHeygenStatus(prev => ({ ...prev, [key]: "sending" }));
    const script = extractSpokenScript(result);

    // Resolve the persisted content ID for this persona's video so the saved
    // row can satisfy the video_outputs -> content_posts foreign key.
    const logEntry = contentLog.find(
      item => item.personaId === persona.id && item.type === "video"
    );
    const postId = genomeId || logEntry?.id || null;

    try {
      const res = await fetch("/.netlify/functions/heygen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, personaId: persona.id, genomeId: genomeId || `LT-V-P${persona.id}` }),
      });
      const data = await res.json();
      const videoId = data.data?.video_id || data.video_id;
      if (!videoId) {
        setHeygenStatus(prev => ({ ...prev, [key]: "error" }));
        return;
      }

      // Render is queued — poll the status endpoint until HeyGen reports the
      // video as completed, then store and persist the resulting URL.
      setHeygenStatus(prev => ({ ...prev, [key]: "processing" }));
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        if (attempts > 60) {
          clearInterval(interval);
          setHeygenStatus(prev => ({ ...prev, [key]: "error" }));
          return;
        }
        try {
          const statusRes = await fetch(`/.netlify/functions/heygen-status?video_id=${videoId}`);
          const statusData = await statusRes.json();
          if (statusData.status === "completed") {
            clearInterval(interval);
            setHeygenStatus(prev => ({ ...prev, [key]: "success" }));
            if (statusData.video_url) {
              setHeygenOutputs(prev => ({ ...prev, [persona.id]: statusData.video_url }));

              // Persist the video URL so the Watch Video link survives a refresh.
              try {
                await fetch("/api/content", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    kind: "video",
                    post_id: postId,
                    persona_id: persona.id,
                    video_id: videoId,
                    video_url: statusData.video_url,
                    generated_at: new Date().toISOString(),
                  }),
                });
              } catch {
                // Non-blocking — the link already renders from local state.
              }
            }
          } else if (statusData.status === "failed") {
            clearInterval(interval);
            setHeygenStatus(prev => ({ ...prev, [key]: "error" }));
          }
        } catch {
          clearInterval(interval);
          setHeygenStatus(prev => ({ ...prev, [key]: "error" }));
        }
      }, 10000);
    } catch (err) {
      setHeygenStatus(prev => ({ ...prev, [key]: "error" }));
    }
  };

  const sendToPostNitro = async (e, persona, result, genomeId) => {
  e.stopPropagation();
  const key = `postnitro_${persona.id}`;
  setPostnitroStatus(prev => ({ ...prev, [key]: "sending" }));

  // Parse slides from ### SLIDE N format
  const slideRegex = /###\s+SLIDE\s+\d+[^\n]*/gi;
  const slidePositions = [];
  let match;
  while ((match = slideRegex.exec(result)) !== null) {
    slidePositions.push(match.index);
  }

  let slides = [];
  if (slidePositions.length >= 3) {
    const slideTexts = slidePositions.map((pos, i) => {
      const end = slidePositions[i + 1] || result.length;
      return result.slice(pos, end);
    });

    slides = slideTexts.slice(0, 3).map((block, i) => {
      const headlineLines = [];
      const headlineSection = block.match(/Headline Text[:\s*]+\n((?:>[^\n]+\n?)+)/i);
      if (headlineSection) {
        headlineLines.push(...headlineSection[1].match(/>[^\n]+/g)
          ?.map(l => l.replace(/^>\s*/, "").replace(/\*/g, "").trim()) || []);
      }
      const headlineMatch = headlineLines.length ? [null, headlineLines.join(" ")] : null;

      const bodyMatch = block.match(/Body Text[^\n]*\n((?:>[^\n]+\n?)+)/i) ||
                  block.match(/Body Text[:\s*]+(?:\n+)?>\s*([^\n]+(?:\n(?!###|##|\*\*)[^\n]+)*)/i) ||
                  block.match(/Body Text[:\s*]+(?:\n+)?([^\n#>*]+(?:\n(?!###|##)[^\n#>*]+)*)/i);

      const heading = headlineMatch ? headlineMatch[1].replace(/[*">]/g, "").trim() : `Slide ${i + 1}`;
      const description = bodyMatch ? bodyMatch[1].replace(/[*>]/g, "").trim() : persona.angle;

      return {
        type: i === 0 ? "starting_slide" : i === slideTexts.length - 1 ? "ending_slide" : "body_slide",
        heading: heading || `Slide ${i + 1}`,
        description: description || persona.angle,
      };
    });
  } else {
    slides = [
      { type: "starting_slide", heading: "Did you know?", description: result.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 100) || "" },
      { type: "body_slide", heading: "Here's what helps", description: persona.angle },
      { type: "ending_slide", heading: "Try Lipitrex", description: "Plant-based support for fluid balance. Link in bio." },
    ];
  }

  try {
    // Step 1 — initiate
    const initRes = await fetch("https://lipitrex-dashboard.vercel.app/api/postnitro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides }),
    });
    const initData = await initRes.json();
    if (!initData.embedPostId) {
      setPostnitroStatus(prev => ({ ...prev, [key]: "error" }));
      return;
    }

    const embedPostId = initData.embedPostId;

    // Resolve the persisted content ID for this carousel so the saved row can
    // satisfy the carousel_outputs -> content_posts foreign key.
    const logEntry = contentLog.find(
      item => item.personaId === persona.id && item.type === "carousel"
    );
    const postId = genomeId || logEntry?.id;

    // Step 2 — poll from frontend
let attempts = 0;
const interval = setInterval(async () => {
  attempts++;
  if (attempts > 20) {
    clearInterval(interval);
    setPostnitroStatus(prev => ({ ...prev, [key]: "error" }));
    return;
  }
  try {
    const statusRes = await fetch(`https://lipitrex-dashboard.vercel.app/api/postnitro-status?embedPostId=${embedPostId}`);
    const statusData = await statusRes.json();
    if (statusData.status === "COMPLETED") {
      clearInterval(interval);
      setPostnitroStatus(prev => ({ ...prev, [key]: "success" }));
      if (statusData.images?.length) {
        setPostnitroOutputs(prev => ({ ...prev, [key]: statusData.images }));

        // Persist the slide URLs to Netlify DB so thumbnails survive a refresh.
        if (postId) {
          try {
            await fetch("/api/content", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                kind: "carousel",
                post_id: postId,
                persona_id: persona.id,
                embed_post_id: embedPostId,
                slide_1_url: statusData.images[0],
                slide_2_url: statusData.images[1],
                slide_3_url: statusData.images[2],
                generated_at: new Date().toISOString(),
              }),
            });
          } catch {
            // Non-blocking — the thumbnails already render from local state.
          }
        }
      }
    } else if (statusData.status === "FAILED") {
      clearInterval(interval);
      setPostnitroStatus(prev => ({ ...prev, [key]: "error" }));
    }
  } catch {
    clearInterval(interval);
    setPostnitroStatus(prev => ({ ...prev, [key]: "error" }));
  }
}, 3000);

  } catch (err) {
    setPostnitroStatus(prev => ({ ...prev, [key]: "error" }));
  }
};

  const TABS = [
    { id: "generate", label: "Generate", emoji: "🎬" },
    { id: "track", label: "Track", emoji: "📊" },
    { id: "insights", label: "Insights", emoji: "💡" },
    { id: "genome", label: "Genome", emoji: "🌀" },
    { id: "landing", label: "Landing Page", emoji: "🏆" },
    { id: "reporting", label: "Assets", emoji: "🔗" },
    { id: "sop", label: "User Manual", emoji: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: T.ink }}>

      {/* HEADER */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: T.shadow }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💧</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: T.ink, lineHeight: 1 }}>Lipitrex</div>
                <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>Content Intelligence Platform</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Badge color={T.green} bg={T.greenLight}>● Live</Badge>
              <div style={{ fontSize: "11px", color: T.muted, fontFamily: "monospace" }}>
                Offset {currentOffset} · {new Date().toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'})}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px", marginTop: "12px" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "10px 16px", background: "none", border: "none",
                borderBottom: `2px solid ${tab === t.id ? T.gold : "transparent"}`,
                color: tab === t.id ? T.gold : T.muted,
                fontSize: "13px", fontWeight: tab === t.id ? 700 : 500,
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 20px" }}>

        {/* ── GENERATE TAB ── */}
        {tab === "generate" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Posts / Week", value: "50", sub: "25 video + 25 carousel" },
                { label: "Personas", value: "5", sub: "Research-backed" },
                { label: "Formats", value: "10", sub: "5 video + 5 carousel" },
                { label: "Today", value: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric'}), sub: `Offset ${currentOffset} · ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()]}` },
              ].map(s => (
                <Card key={s.label} style={{ padding: "16px", textAlign: "center" }}>
                  <Stat {...s} />
                </Card>
              ))}
            </div>

            <Card style={{ marginBottom: "20px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[["video", "🎬 Video Posts"], ["carousel", "🖼️ Carousel Posts"]].map(([type, label]) => (
                    <button key={type} onClick={() => setGenType(type)} style={{
                      padding: "8px 18px", borderRadius: T.radiusSm,
                      border: `1px solid ${genType === type ? T.gold : T.border}`,
                      background: genType === type ? T.goldLight : T.white,
                      color: genType === type ? T.goldDark : T.muted,
                      fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    }}>{label}</button>
                  ))}
                </div>
                <Btn onClick={generateAll}>
                  ⚡ Generate All 5 {genType === "video" ? "Videos" : "Carousels"} — Week {week}
                </Btn>
              </div>
            </Card>

            <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${heygenConnected ? T.green : T.gold}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>🎥</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>HeyGen Direct Connection</div>
                    <div style={{ fontSize: "11px", color: T.muted }}>
                      {heygenConnected ? "Connected — posts generate directly to HeyGen" : "Enter API key to enable one-click video production · 230+ avatars · demographic matching ready"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {!heygenConnected && (
                    <Input value={heygenKey} onChange={setHeygenKey} placeholder="HeyGen API key..." style={{ width: "200px" }} />
                  )}
                  <Btn variant={heygenConnected ? "ghost" : "primary"} onClick={() => {
                    if (heygenKey.length > 5) setHeygenConnected(true);
                    else if (heygenConnected) { setHeygenConnected(false); setHeygenKey(""); }
                  }}>
                    {heygenConnected ? "Disconnect" : "Connect"}
                  </Btn>
                  {heygenConnected && <Badge color={T.green} bg={T.greenLight}>✓ Connected</Badge>}
                </div>
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {PERSONAS.map(p => {
                const format = getFormatForPersona(p.id, genType);
                const key = `${genType}_${p.id}`;
                const result = results[key];
                const isLoading = loading[key];
                const isExpanded = expanded === key;

                return (
                  <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px", borderBottom: result ? `1px solid ${T.border}` : "none",
                      background: result ? p.light : T.white, cursor: result ? "pointer" : "default",
                    }} onClick={() => result && setExpanded(isExpanded ? null : key)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                          width: "42px", height: "42px", borderRadius: "10px",
                          background: p.light, display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "20px", flexShrink: 0,
                          border: `1px solid ${p.color}33`,
                        }}>{p.emoji}</div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: T.ink }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>{p.tag}</div>
                        </div>
                        <Badge color={p.color} bg={p.light}>{format.emoji} {format.label}</Badge>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {isLoading && (
                          <span style={{ fontSize: "12px", color: T.muted }}>Generating...</span>
                        )}
                        {result && !isLoading && (
                          <>
                            {heygenConnected && genType === "video" && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "stretch" }}>
                                <Btn variant="secondary" style={{
                                  fontSize: "12px", padding: "6px 12px",
                                  background: heygenStatus[`heygen_${p.id}`] === "success" ? T.greenLight :
                                    heygenStatus[`heygen_${p.id}`] === "error" ? T.redLight : undefined,
                                }} onClick={e => sendToHeyGen(e, p, result, null)}>
                                  {heygenStatus[`heygen_${p.id}`] === "sending" ? "Sending..." :
                                    heygenStatus[`heygen_${p.id}`] === "processing" ? "Rendering..." :
                                    heygenStatus[`heygen_${p.id}`] === "success" ? "✓ Sent to HeyGen" :
                                    heygenStatus[`heygen_${p.id}`] === "error" ? "Error — Retry" :
                                    "Send to HeyGen →"}
                                </Btn>
                                {heygenOutputs[p.id] && (
                                  <a href={heygenOutputs[p.id]} target="_blank" rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      display: "block", textAlign: "center", textDecoration: "none",
                                      fontSize: "12px", fontWeight: 600, padding: "6px 12px",
                                      borderRadius: T.radiusSm, background: T.blueLight, color: T.blue,
                                    }}>
                                    Watch Video ▶
                                  </a>
                                )}
                              </div>
                            )}
                            {genType === "carousel" && (
                              <Btn variant="secondary" style={{
                                fontSize: "12px", padding: "6px 12px",
                                background: postnitroStatus[`postnitro_${p.id}`] === "success" ? T.greenLight :
                                  postnitroStatus[`postnitro_${p.id}`] === "error" ? T.redLight : undefined,
                              }} onClick={e => sendToPostNitro(e, p, result, null)}>
                                {postnitroStatus[`postnitro_${p.id}`] === "sending" ? "Sending..." :
                                  postnitroStatus[`postnitro_${p.id}`] === "success" ? "✓ Sent to PostNitro" :
                                  postnitroStatus[`postnitro_${p.id}`] === "error" ? "Error — Retry" :
                                  "Send to PostNitro →"}
                              </Btn>
                            )}
                            <Btn variant="ghost" style={{ fontSize: "12px", padding: "6px 12px" }}
                              onClick={e => { e.stopPropagation(); copyWithFeedback(`gen_${key}`, result); }}>
                              {copiedKey === `gen_${key}` ? "✓ Copied!" : "Copy"}
                            </Btn>
                          </>
                        )}
                        {!result && !isLoading && (
                          <Btn variant="secondary" style={{ fontSize: "12px", padding: "6px 14px" }}
                            onClick={() => generatePost(p, genType)}>
                            Generate
                          </Btn>
                        )}
                        {result && (
                          <span style={{ color: T.muted, fontSize: "16px" }}>{isExpanded ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </div>

                    {!result && !isLoading && (
                      <div style={{ padding: "12px 20px 16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {p.painPoints.map((pt, i) => (
                          <span key={i} style={{
                            fontSize: "11px", color: T.muted, background: T.faint,
                            padding: "3px 10px", borderRadius: "20px", border: `1px solid ${T.border}`,
                          }}>· {pt}</span>
                        ))}
                      </div>
                    )}

                    {isLoading && (
                      <div style={{ padding: "20px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                        Building content package for {p.name}...
                      </div>
                    )}

                    {result && !isExpanded && (
                      <div style={{ padding: "10px 20px 14px" }}>
                        <div style={{ fontSize: "12px", color: T.muted, fontStyle: "italic", lineHeight: 1.5 }}>
                          {result.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 140)}...
                        </div>
                      </div>
                    )}

                    {result && isExpanded && (
  <div style={{
    padding: "20px", fontSize: "13px", lineHeight: 1.8,
    color: T.body, whiteSpace: "pre-wrap",
    maxHeight: "500px", overflowY: "auto",
    borderTop: `1px solid ${T.border}`,
  }}>
    {result}
  </div>
)}
{postnitroOutputs[`postnitro_${p.id}`] && (
  <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
    <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
      Generated Carousel Slides
    </div>
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {postnitroOutputs[`postnitro_${p.id}`].map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <img
            src={url}
            alt={`Slide ${i + 1}`}
            style={{
              width: "120px",
              height: "213px",
              objectFit: "cover",
              borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
              cursor: "pointer",
            }}
          />
          <div style={{ fontSize: "10px", color: T.muted, textAlign: "center", marginTop: "4px" }}>
            Slide {i + 1} ↗
          </div>
        </a>
      ))}
    </div>
  </div>
)}
</Card>
                );
              })}
            </div>
          </>
        )}

        {/* ── TRACK TAB ── */}
        {tab === "track" && (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[["video", "🎬 Video Matrix"], ["carousel", "🖼️ Carousel Matrix"]].map(([type, label]) => (
                <button key={type} onClick={() => { setTrackType(type); setTrackFormat(type === "video" ? VIDEO_FORMATS[0].id : CAROUSEL_FORMATS[0].id); }} style={{
                  padding: "8px 18px", borderRadius: T.radiusSm,
                  border: `1px solid ${trackType === type ? T.gold : T.border}`,
                  background: trackType === type ? T.goldLight : T.white,
                  color: trackType === type ? T.goldDark : T.muted,
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                }}>{label}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
              {(trackType === "video" ? VIDEO_FORMATS : CAROUSEL_FORMATS).map(f => (
                <button key={f.id} onClick={() => setTrackFormat(f.id)} style={{
                  padding: "6px 14px", borderRadius: T.radiusSm,
                  border: `1px solid ${trackFormat === f.id ? T.gold : T.border}`,
                  background: trackFormat === f.id ? T.goldLight : T.white,
                  color: trackFormat === f.id ? T.goldDark : T.muted,
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}>{f.emoji} {f.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PERSONAS.map(p => {
                const metrics = trackType === "video" ? videoMetrics : carouselMetrics;
                const d = metrics[trackFormat]?.[p.id] || {};
                const saveRate = d.views && d.saves ? ((parseFloat(d.saves) / parseFloat(d.views)) * 100).toFixed(1) : null;

                return (
                  <Card key={p.id} style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{p.emoji}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: p.color }}>{p.name}</span>
                      </div>
                      {saveRate && (
                        <Badge color={T.green} bg={T.greenLight}>Save rate: {saveRate}%</Badge>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                      {[["views", "👁 Views"], ["saves", "🔖 Saves"], ["comments", "💬 Comments"], ["completion", "⏱ Completion %"], ["hold_2s", "⚡ 2s Hold %"], ["view_6s", "🎯 6s View %"]].map(([field, label]) => (
                        <div key={field}>
                          <Label>{label}</Label>
                          <Input
                            value={d[field] || ""}
                            onChange={val => updateMetric(trackType, trackFormat, p.id, field, val)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* ── INSIGHTS TAB ── */}
        {tab === "insights" && (() => {
          const allScores = [];
          const personaScores = {};
          const formatScores = {};

          PERSONAS.forEach(p => {
            let pTotal = 0, pCount = 0;
            VIDEO_FORMATS.forEach(f => {
              const score = getSignalScore(videoMetrics, f.id, p.id);
              if (score) {
                const s = parseFloat(score);
                allScores.push({ persona: p, format: f, type: "video", score: s });
                pTotal += s; pCount++;
                formatScores[f.id] = (formatScores[f.id] || []);
                formatScores[f.id].push(s);
              }
            });
            CAROUSEL_FORMATS.forEach(f => {
              const score = getSignalScore(carouselMetrics, f.id, p.id);
              if (score) {
                const s = parseFloat(score);
                allScores.push({ persona: p, format: f, type: "carousel", score: s });
                pTotal += s; pCount++;
                formatScores[f.id] = (formatScores[f.id] || []);
                formatScores[f.id].push(s);
              }
            });
            if (pCount > 0) personaScores[p.id] = { persona: p, avg: (pTotal / pCount).toFixed(1), count: pCount };
          });

          const topContent = [...allScores].sort((a, b) => b.score - a.score).slice(0, 3);
          const bottomContent = [...allScores].sort((a, b) => a.score - b.score).slice(0, 3);
          const rankedPersonas = Object.values(personaScores).sort((a, b) => b.avg - a.avg);
          const hasData = allScores.length > 0;

          const videoAvg = VIDEO_FORMATS.reduce((sum, f) => {
            const rates = PERSONAS.map(p => parseFloat(getSaveRate(videoMetrics, f.id, p.id) || 0));
            return sum + rates.reduce((a, b) => a + b, 0) / rates.filter(r => r > 0).length || 0;
          }, 0) / VIDEO_FORMATS.length;
          const carouselAvg = CAROUSEL_FORMATS.reduce((sum, f) => {
            const rates = PERSONAS.map(p => parseFloat(getSaveRate(carouselMetrics, f.id, p.id) || 0));
            return sum + rates.reduce((a, b) => a + b, 0) / rates.filter(r => r > 0).length || 0;
          }, 0) / CAROUSEL_FORMATS.length;
          const baitAnchorHealthy = carouselAvg >= videoAvg * 0.7;

          return (
            <>
              {!hasData && (
                <Card style={{ padding: "32px", textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>💡</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: T.ink, marginBottom: "6px" }}>No performance data yet</div>
                  <div style={{ fontSize: "12px", color: T.muted }}>Enter 2s hold %, 6s view %, saves, and views in the Track tab after posts go live.</div>
                </Card>
              )}

              <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${baitAnchorHealthy ? T.green : T.gold}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Label>Bait / Anchor Health</Label>
                  <Badge color={baitAnchorHealthy ? T.green : T.gold} bg={baitAnchorHealthy ? T.greenLight : T.goldLight}>
                    {baitAnchorHealthy ? "✓ System Healthy" : "⚠ Anchor Needs Attention"}
                  </Badge>
                </div>
                <div style={{ fontSize: "12px", color: T.muted, marginTop: "6px" }}>
                  {baitAnchorHealthy
                    ? "Video reach and carousel saves are growing together. The bait is working and the anchor is converting."
                    : "Video reach is outpacing carousel saves. Revise carousel formats — the anchor isn't converting warm viewers."}
                </div>
              </Card>

              {[["video", "🎬 Video Signal Matrix", VIDEO_FORMATS, videoMetrics], ["carousel", "🖼️ Carousel Signal Matrix", CAROUSEL_FORMATS, carouselMetrics]].map(([type, label, formats, metrics]) => (
                <Card key={type} style={{ marginBottom: "20px", padding: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "11px", color: T.muted, marginBottom: "16px" }}>Weighted Signal Score = 2s Hold (30%) + 6s View (40%) + Save Rate (30%)</div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ background: T.faint }}>
                          <th style={{ padding: "10px 12px", textAlign: "left", color: T.muted, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>Persona</th>
                          {formats.map(f => (
                            <th key={f.id} style={{ padding: "10px 12px", textAlign: "center", color: T.muted, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>
                              {f.emoji}<br /><span style={{ fontSize: "10px" }}>{f.label.split("/")[0].trim()}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PERSONAS.map(p => (
                          <tr key={p.id}>
                            <td style={{ padding: "10px 12px", fontWeight: 600, color: p.color, borderBottom: `1px solid ${T.border}` }}>
                              {p.emoji} {p.short}
                            </td>
                            {formats.map(f => {
                              const score = getSignalScore(metrics, f.id, p.id);
                              const allS = formats.map(ff => parseFloat(getSignalScore(metrics, ff.id, p.id) || 0));
                              const isBest = score && parseFloat(score) === Math.max(...allS) && Math.max(...allS) > 0;
                              const val = parseFloat(score || 0);
                              const bg = !score ? T.white : val >= 60 ? p.light : val >= 30 ? T.faint : T.white;
                              return (
                                <td key={f.id} style={{
                                  padding: "10px 12px", textAlign: "center",
                                  background: bg, color: isBest ? p.color : score ? T.body : T.border,
                                  fontWeight: isBest ? 800 : 400, borderBottom: `1px solid ${T.border}`,
                                }}>
                                  {score ? `${score}` : "—"}
                                  {isBest && <div style={{ fontSize: "9px", color: p.color }}>★ TOP</div>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}

              {rankedPersonas.length > 0 && (
                <Card style={{ marginBottom: "20px", padding: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>📊 Persona Performance Ranking</div>
                  {rankedPersonas.map((ps, i) => (
                    <div key={ps.persona.id} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px", marginBottom: "8px",
                      background: i === 0 ? ps.persona.light : T.faint,
                      borderRadius: "8px", border: `1px solid ${i === 0 ? ps.persona.color + "44" : T.border}`,
                    }}>
                      <div style={{ fontSize: "20px", fontWeight: 900, color: i === 0 ? ps.persona.color : T.muted, minWidth: "28px" }}>#{i + 1}</div>
                      <div style={{ fontSize: "20px" }}>{ps.persona.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: ps.persona.color }}>{ps.persona.name}</div>
                        <div style={{ fontSize: "11px", color: T.muted }}>{ps.count} data points</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: 900, color: i === 0 ? ps.persona.color : T.body }}>{ps.avg}</div>
                        <div style={{ fontSize: "10px", color: T.muted }}>signal score</div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {topContent.length > 0 && (
                <Card style={{ marginBottom: "20px", padding: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>🎯 Content Recommendations</div>
                  <div style={{ fontSize: "11px", color: T.muted, marginBottom: "16px" }}>Based on signal score performance</div>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: T.green, marginBottom: "8px" }}>▲ Double Down — Highest Signal</div>
                    {topContent.map((c, i) => (
                      <div key={i} style={{
                        padding: "10px 14px", marginBottom: "6px",
                        background: T.greenLight, borderRadius: "8px",
                        border: `1px solid ${T.green}33`,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <div>
                          <span style={{ fontWeight: 700, color: c.persona.color }}>{c.persona.emoji} {c.persona.short}</span>
                          <span style={{ color: T.muted, fontSize: "12px" }}> × {c.format.emoji} {c.format.label} ({c.type})</span>
                        </div>
                        <Badge color={T.green} bg={T.greenLight}>Score: {c.score.toFixed(1)}</Badge>
                      </div>
                    ))}
                  </div>
                  {bottomContent.length > 0 && (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: T.gold, marginBottom: "8px" }}>▼ Revise or Replace — Lowest Signal</div>
                      {bottomContent.map((c, i) => (
                        <div key={i} style={{
                          padding: "10px 14px", marginBottom: "6px",
                          background: T.goldLight, borderRadius: "8px",
                          border: `1px solid ${T.gold}33`,
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <div>
                            <span style={{ fontWeight: 700, color: c.persona.color }}>{c.persona.emoji} {c.persona.short}</span>
                            <span style={{ color: T.muted, fontSize: "12px" }}> × {c.format.emoji} {c.format.label} ({c.type})</span>
                          </div>
                          <Badge color={T.gold} bg={T.goldLight}>Score: {c.score.toFixed(1)}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              <Card style={{ marginBottom: "20px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>📈 Industry Benchmarks — Supplement Category</div>
                {[
                  ["Engagement Rate", "5.7–9%", "TikTok platform average. Supplement wellness content typically outperforms."],
                  ["2s Hold Rate", ">20%", "Minimum threshold — below this TikTok deprioritizes the video in distribution."],
                  ["6s View Rate", ">40%", "Key engaged view threshold. Above 40% signals strong conversion potential."],
                  ["Save Rate", ">2%", "Purchase-intent signal. Supplement educational content benchmarks 2–5%."],
                  ["CTR (paid)", "0.84%", "Industry average for supplement ads. Top 1% ads exceed 3%."],
                  ["Conversion Rate", "0.46%", "E-commerce TikTok average. Attribution captures only ~10–20% of actual influence."],
                ].map(([metric, benchmark, note]) => (
                  <div key={metric} style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "10px 0", borderBottom: `1px solid ${T.border}`,
                  }}>
                    <div style={{ minWidth: "140px", fontWeight: 700, fontSize: "12px", color: T.body }}>{metric}</div>
                    <div style={{ minWidth: "80px", fontWeight: 900, fontSize: "13px", color: T.gold }}>{benchmark}</div>
                    <div style={{ fontSize: "11px", color: T.muted, flex: 1 }}>{note}</div>
                  </div>
                ))}
              </Card>
            </>
          );
        })()}

        {/* ── GENOME TAB ── */}
        {tab === "genome" && (
          <>
            <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${T.gold}` }}>
              <Label>Content Genome System</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                Every piece of generated content receives a unique ID and attribute tags at creation.
                Track its full lifetime from Organic → Paid → Evergreen → Cross-Platform → Repurposed → Templated → Retired.
              </div>
            </Card>

            <div style={{
              display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px",
              background: T.white, border: `1px solid ${T.border}`, borderRadius: T.radius,
              boxShadow: T.shadow, padding: "14px 16px", marginBottom: "16px",
            }}>
              {/* Date range */}
              <div>
                <Label>Date Range</Label>
                <select value={genomeDateRange} onChange={e => setGenomeDateRange(e.target.value)} style={genomeSelectStyle}>
                  <option value="all">All time</option>
                  <option value="today">Today</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>

              {/* Persona */}
              <div>
                <Label>Persona</Label>
                <select value={genomePersona} onChange={e => setGenomePersona(e.target.value)} style={genomeSelectStyle}>
                  <option value="all">All Personas</option>
                  {PERSONAS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              {/* Content type toggle */}
              <div>
                <Label>Content Type</Label>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[["all", "All"], ["video", "Video"], ["carousel", "Carousel"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setGenomeType(val)} style={{
                      padding: "7px 12px", borderRadius: T.radiusXs,
                      border: `1px solid ${genomeType === val ? T.gold : T.border}`,
                      background: genomeType === val ? T.goldLight : T.white,
                      color: genomeType === val ? T.goldDark : T.muted,
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    }}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <Label>Format</Label>
                <select value={genomeFormat} onChange={e => setGenomeFormat(e.target.value)} style={genomeSelectStyle}>
                  <option value="all">All Formats</option>
                  {ALL_FORMATS.map(f => <option key={f.id} value={f.label}>{f.label}</option>)}
                </select>
              </div>

              {/* Stage */}
              <div>
                <Label>Stage</Label>
                <select value={genomeStage} onChange={e => setGenomeStage(e.target.value)} style={genomeSelectStyle}>
                  <option value="all">All Stages</option>
                  {CONTENT_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Filtered count + bulk export */}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: T.gold }}>
                    Showing {genomeFiltered.length} of {contentLog.length}
                  </div>
                  <div style={{ fontSize: "11px", color: T.subtle, marginTop: "2px" }}>content IDs</div>
                </div>
                <Btn variant="secondary" style={{ fontSize: "12px", padding: "8px 14px" }}
                  disabled={genomeFiltered.length === 0}
                  onClick={downloadGenomeResults}>
                  ⬇ Download Results
                </Btn>
              </div>
            </div>

            {contentLog.length === 0 ? (
              <Card style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🧬</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>No content IDs yet</div>
                <div style={{ fontSize: "12px", color: T.muted }}>Generate posts in the Generate tab — each one receives a unique ID and attribute tags automatically.</div>
              </Card>
            ) : genomeFiltered.length === 0 ? (
              <Card style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>No content matches these filters</div>
                <div style={{ fontSize: "12px", color: T.muted }}>Try widening the date range or clearing a filter to see more content IDs.</div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {genomeFiltered
                  .map(item => {
                    const isOpen = genomeExpanded === item.id;
                    const fullOutput = item.fullOutput ?? genomeOutputs[item.id];
                    const isFetching = genomeFetching[item.id];
                    return (
                    <Card key={item.id} style={{ padding: "16px" }}>
                      <div
                        onClick={() => toggleGenomeCard(item)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px" }}>{item.personaEmoji}</span>
                          <div>
                            <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: T.gold }}>{item.id}</div>
                            <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>{item.persona} · {item.format} · {item.date}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Badge color={item.type === "video" ? T.blue : T.gold} bg={item.type === "video" ? T.blueLight : T.goldLight}>
                            {item.type === "video" ? "🎬 Video" : "🖼️ Carousel"}
                          </Badge>
                          <span style={{ color: T.muted, fontSize: "14px" }}>{isOpen ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <span key={k} style={{
                            fontSize: "10px", background: T.faint, color: T.muted,
                            padding: "2px 8px", borderRadius: "4px", border: `1px solid ${T.border}`,
                          }}>
                            <span style={{ fontWeight: 600, color: T.body }}>{k}:</span> {v}
                          </span>
                        ))}
                      </div>

                      {isOpen && (
                        <div style={{
                          marginBottom: "12px", border: `1px solid ${T.border}`,
                          borderRadius: T.radiusSm, overflow: "hidden",
                        }}>
                          <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 14px", background: T.faint, borderBottom: `1px solid ${T.border}`,
                          }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                              Full Output
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <Btn variant="ghost" style={{ fontSize: "12px", padding: "6px 12px" }}
                                disabled={!fullOutput}
                                onClick={() => fullOutput && copyWithFeedback(`genome_${item.id}`, fullOutput)}>
                                {copiedKey === `genome_${item.id}` ? "✓ Copied!" : "Copy"}
                              </Btn>
                              <Btn variant="ghost" style={{ fontSize: "12px", padding: "6px 12px" }}
                                disabled={!fullOutput}
                                onClick={() => fullOutput && downloadFile(`${item.id}.txt`, fullOutput)}>
                                Download
                              </Btn>
                              <Btn variant="ghost" style={{ fontSize: "12px", padding: "6px 12px" }}
                                onClick={() => setGenomeExpanded(null)}>
                                Close
                              </Btn>
                            </div>
                          </div>
                          <div style={{
                            padding: "20px", fontSize: "13px", lineHeight: 1.8,
                            color: T.body, whiteSpace: "pre-wrap",
                            maxHeight: "500px", overflowY: "auto", background: T.white,
                          }}>
                            {isFetching
                              ? <span style={{ color: T.muted, fontStyle: "italic" }}>Loading full output...</span>
                              : fullOutput
                                ? fullOutput
                                : <span style={{ color: T.muted, fontStyle: "italic" }}>No full output available for this content ID.</span>}
                          </div>
                        </div>
                      )}

                      {item.stage === "Templated" && (
                        <div style={{
                          marginTop: "12px", padding: "12px 14px",
                          background: T.goldLight, borderRadius: T.radiusSm,
                          border: `1px solid ${T.gold}55`,
                        }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: T.goldDark, marginBottom: "6px" }}>
                            🏆 Landing Page Signal Activated
                          </div>
                          <div style={{ fontSize: "11px", color: T.goldDark, lineHeight: 1.6 }}>
                            This content's hook language and CTA tone are recommended for the Lipitrex Amazon listing and landing pages.
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Lifetime Stage</Label>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {CONTENT_STAGES.map((stage, i) => {
                            const currentIdx = CONTENT_STAGES.indexOf(item.stage);
                            const isPast = i < currentIdx;
                            const isCurrent = stage === item.stage;
                            return (
                              <button key={stage} onClick={() => updateStage(item.id, stage)} style={{
                                padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                                border: `1px solid ${isCurrent ? T.gold : T.border}`,
                                background: isCurrent ? T.goldLight : isPast ? T.faint : T.white,
                                color: isCurrent ? T.goldDark : isPast ? T.subtle : T.muted,
                                cursor: "pointer",
                              }}>{stage}</button>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  );
                  })}
              </div>
            )}
          </>
        )}

        {/* ── LANDING PAGE TAB ── */}
        {tab === "landing" && (
          <>
            <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${T.gold}` }}>
              <Label>Landing Page Intelligence</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                When content reaches Stage 6 — Templated — the system activates a Landing Page Signal.
                The hook language, pain point framing, emotional tone, and CTA structure from winning content
                maps directly to your Amazon listing, A+ content, and product landing pages.
              </div>
            </Card>

            <Card style={{ marginBottom: "20px", padding: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Content → Listing Translation</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  ["🎬 Hook Language", "Above the fold headline", "The hook that stopped the scroll in 2 seconds is the headline that stops the browser scroll."],
                  ["😤 Pain Point Comments", "Bullet points", "The pain points generating the most comment sentiment become your primary listing bullet points — in the buyer's own language."],
                  ["📖 Before & After Story", "Testimonial section", "The story arc that resonates becomes the testimonial template and featured review structure."],
                  ["🌿 Ingredient Spotlight", "A+ content modules", "The ingredient that gets bookmarked most becomes the A+ content structure."],
                  ["📣 CTA Tone", "Add to Cart copy", "The CTA aggressiveness that appears most in high-attribution IDs becomes the listing CTA approach."],
                  ["👤 Avatar Demographics", "Ad targeting", "The persona with the highest Amazon Attribution conversion rate becomes your primary paid targeting demographic."],
                ].map(([source, element, desc], i) => (
                  <div key={i} style={{
                    padding: "14px", background: i % 2 === 0 ? T.faint : T.white,
                    borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
                  }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: T.ink, marginBottom: "4px" }}>{source}</div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: T.gold, marginBottom: "6px" }}>→ {element}</div>
                    <div style={{ fontSize: "11px", color: T.muted, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ marginBottom: "8px" }}>
              <Label>Active Landing Page Signals — From Templated Content</Label>
            </div>
            {contentLog.filter(item => item.stage === "Templated").length === 0 ? (
              <Card style={{ padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>🏆</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>No Templated content yet</div>
                <div style={{ fontSize: "12px", color: T.muted }}>
                  As content IDs accumulate and win consistently, the system will flag them as Templated and activate Landing Page Signals here.
                </div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {contentLog.filter(item => item.stage === "Templated").map(item => (
                  <Card key={item.id} style={{ padding: "16px", borderLeft: `3px solid ${T.gold}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "18px" }}>{item.personaEmoji}</span>
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: "12px", color: T.gold, fontWeight: 700 }}>{item.id}</div>
                        <div style={{ fontSize: "11px", color: T.muted }}>{item.persona} · {item.format}</div>
                      </div>
                      <Badge color={T.gold} bg={T.goldLight}>🏆 Landing Page Signal</Badge>
                    </div>
                    <div style={{ background: T.goldLight, borderRadius: T.radiusSm, padding: "12px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: T.goldDark, marginBottom: "6px" }}>Recommended Listing Element</div>
                      <div style={{ fontSize: "12px", color: T.goldDark, lineHeight: 1.6 }}>
                        This content's winning attributes — hook language, pain point framing, emotional tone, CTA structure —
                        are recommended for your Lipitrex Amazon listing and product landing pages.
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Card style={{ marginTop: "20px", padding: "16px", background: T.faint }}>
              <Label>Multi-Supplement Extension</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                Every supplement in Brad's catalog gets its own genome, its own matrix, and its own landing page signals.
                As the catalog builds, the genomes cross-reference — a buyer who converts on Lipitrex has attributes
                that predict which other supplements they'll buy.
              </div>
            </Card>
          </>
        )}

        {/* ── ASSETS TAB ── */}
        {tab === "reporting" && (
          <>
            <div style={{ marginBottom: "8px" }}>
              <Label>Active — Connected Now</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { name: "GitHub", desc: "Source code repository for the Lipitrex dashboard. All code changes deploy automatically to Netlify from the main branch. Repo: jmarks3/lipitrex-dashboard.", url: "https://github.com/jmarks3/lipitrex-dashboard", cost: "Free" },                
                { name: "TikTok Studio", desc: "Native analytics — views, saves, follower growth, watch time, completion rate.", url: "https://studio.tiktok.com", cost: "Free" },
                { name: "Amazon Attribution", desc: "Tracks TikTok bio link clicks through to Amazon purchases. ASIN: B08B9SH5XH.", url: "https://advertising.amazon.com", cost: "Free" },
                { name: "TikTok Creative Center", desc: "Free competitor intelligence — search competing supplement brands' ad content.", url: "https://ads.tiktok.com/business/creativecenter", cost: "Free" },
                { name: "PostNitro", desc: "Automated carousel generation. Triggered directly from the Generate tab when Carousel Posts mode is active.", url: "https://postnitro.ai", cost: "$25 + $10 API/mo" },
                { name: "HeyGen", desc: "AI avatar video production. Five personas mapped to five avatars. Videos render in HeyGen library after 'Send to HeyGen' — Brad downloads and posts to TikTok.", url: "https://app.heygen.com", cost: "$29/mo + API credits" },
                { name: "Anthropic Console", desc: "Content intelligence agent. Manages the system prompt, offset rotation logic, and persona tone guides that power every generation.", url: "https://console.anthropic.com", cost: "Usage-based" },
                { name: "Netlify", desc: "Hosts the dashboard at dashboard.lipitrex.com. Handles the HeyGen serverless function and all frontend deploys.", url: "https://app.netlify.com", cost: "$9/mo" },
                { name: "Netlify DB", desc: "Managed Postgres database. Stores all generated content IDs, genome lifecycle stages, carousel outputs, and performance metrics. Data persists across sessions and is isolated per deploy preview.", url: "https://app.netlify.com", cost: "Free" },
                { name: "Sentry", desc: "Error monitoring for frontend and serverless functions. Captures unhandled errors with full context so issues are caught before Brad notices them.", url: "https://sentry.io", cost: "Free tier" },
                { name: "Linktree", desc: "Bio link hub for TikTok. Routes all traffic from @progressivehealth bio link through Amazon Attribution tags to the Lipitrex listing. Do not modify links without coordinating with Josh.", url: "https://linktr.ee", cost: "Free" },
              ].map(tool => (
                <Card key={tool.name} style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700 }}>{tool.name}</span>
                        <Badge color={T.green} bg={T.greenLight}>Active</Badge>
                        <span style={{ fontSize: "11px", color: T.muted }}>{tool.cost}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: T.muted, lineHeight: 1.5 }}>{tool.desc}</div>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <Btn variant="secondary" style={{ fontSize: "12px", padding: "6px 14px", marginLeft: "16px" }}>Open →</Btn>
                    </a>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ marginBottom: "8px" }}>
              <Label>Coming Soon — Activates With IG + YouTube Expansion</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { name: "Socialinsider", badge: "Cross-Platform Intelligence", desc: "Competitor benchmarking across TikTok, Instagram Reels, and YouTube Shorts.", cost: "~$99/mo", why: "Activates when IG + YT go live." },
                { name: "NexLev", badge: "YouTube Niche Intelligence", desc: "AI-powered YouTube niche finder. Surfaces breakout channels and underserved content angles.", cost: "Lower tier", why: "Activates with YouTube Shorts expansion." },
                { name: "Amazon Attribution — Per Persona", badge: "Revenue by Persona", desc: "Separate attribution tags per buyer profile via Linktree. Shows which persona drives the most Amazon purchases.", cost: "Free", why: "Ready to activate now — requires Linktree + 5 Amazon Attribution tags." },
              ].map(tool => (
                <Card key={tool.name} style={{ padding: "16px", opacity: 0.65 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: T.muted }}>{tool.name}</span>
                    <Badge color={T.subtle} bg={T.faint}>Coming Soon</Badge>
                    <Badge color={T.subtle} bg={T.faint}>{tool.badge}</Badge>
                    <span style={{ fontSize: "11px", color: T.subtle }}>{tool.cost}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: T.subtle, lineHeight: 1.5, marginBottom: "6px" }}>{tool.desc}</div>
                  <div style={{ fontSize: "11px", color: T.subtle, fontStyle: "italic" }}>→ {tool.why}</div>
                </Card>
              ))}
            </div>

            <Card style={{ padding: "20px" }}>
              <Label>Monthly Cost at Each Stage</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "8px" }}>
                {[["Now", "$88–98", "Claude + PostNitro + HeyGen + Netlify (Anthropic ~$15–25/mo)"], ["With IG + YT", "~$187–197", "+ Socialinsider"], ["At Scale", "~$288+", "+ NexLev + advanced"]].map(([stage, cost, note]) => (
                  <div key={stage} style={{ textAlign: "center", padding: "16px", background: T.faint, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "10px", color: T.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>{stage}</div>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: T.gold }}>{cost}<span style={{ fontSize: "12px", color: T.muted }}>/mo</span></div>
                    <div style={{ fontSize: "11px", color: T.muted, marginTop: "4px" }}>{note}</div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ── USER MANUAL TAB ── */}
        {tab === "sop" && (
          <>
            <Card style={{ marginBottom: "20px", padding: "20px", borderLeft: `3px solid ${T.gold}` }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: T.ink, marginBottom: "4px" }}>Lipitrex Content Intelligence Platform</div>
              <div style={{ fontSize: "12px", color: T.muted }}>User Manual · Prepared by Josh Marks · Harvest Vitality · 2026</div>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.7, marginTop: "12px" }}>
                This manual tells you exactly what the platform is, how it works, and what you need to do each week. The system handles content generation, video production, and carousel creation automatically. Your job is to review, approve, and post. Everything else is handled.
              </div>
            </Card>

            {[
              {
                title: "1. What This Is",
                content: `The Lipitrex Content Intelligence Platform is an AI-powered content engine that generates, produces, and publishes TikTok content for Lipitrex Water Pills — 50 posts per week across 5 buyer personas.\n\nVideos (Bait) — reach new buyers, stop the scroll, create first impression. Produced by HeyGen using AI avatars matched to each persona.\n\nCarousels (Anchor) — build trust, educate, convert warm followers into buyers. Produced by PostNitro and exported as ready-to-post images.\n\nEvery piece of content gets a Content ID (e.g. LT-V-001-P1-0611) that tracks it through 7 lifecycle stages from Organic through to Retired. Over time the system learns what works — and the content gets better automatically.`
              },
              {
                title: "2. The Five Buyer Personas",
                content: `The system generates content for five research-backed buyer profiles that represent Lipitrex's core customers:\n\nP1 — Seniors 55+ (venous insufficiency, heavy legs, afternoon swelling)\nP2 — Weight-Related (chronic swelling, fluid retention, tried everything)\nP3 — Hormonal (perimenopausal women 40–55, hormonal fluid cycles)\nP4 — Nine-to-Five (desk workers, standing jobs, end-of-shift swelling)\nP5 — Rx Side Effects (medication-induced fluid retention, need the meds but hate the swelling)\n\nEach persona has its own AI avatar, voice, pain points, ingredient angle, and content format rotation. The system rotates through all five personas on a 5-week offset cycle so the feed always looks fresh.`
              },
              {
                title: "3. Your Weekly Workflow",
                content: `Your role is simple: review, approve, post.\n\nStep 1 — Generate content\nOpen dashboard.lipitrex.com. Switch between Video Posts and Carousel Posts using the toggle. Click Generate for each persona — or hit Generate All to run all five at once.\n\nStep 2 — Review the output\nEach card expands to show the full content package: hook, script or slide copy, caption, hashtags, and compliance check. Read it. If something looks off, regenerate.\n\nStep 3 — Send to production\nFor videos: click Send to HeyGen → the video renders automatically in your HeyGen library (5–10 minutes).\nFor carousels: click Send to PostNitro → three slide images generate automatically and appear in the dashboard as thumbnails.\n\nStep 4 — Download and post\nDownload the video from HeyGen or the slide images from the dashboard. Open TikTok, paste the caption, post at the recommended time.\n\nNo design work, no script writing, no editing required.`
              },
              {
                title: "4. How to Post to TikTok",
                content: `Posting a Video:\n1. Open TikTok app — log into progressivehealth1\n2. Tap the + button at the bottom\n3. Tap Upload → select the video file\n4. Paste the caption and hashtags from the dashboard\n5. Do not add your own music — audio is already in the video\n6. Tap Post\n\nPosting a Carousel:\n1. Open TikTok app — log into progressivehealth1\n2. Tap the + button\n3. Tap Upload → select all three slide images in order (Slide 1 first)\n4. Tap Next → paste the caption and hashtags\n5. Tap Post\n\nNever change the Linktree bio link without coordinating with Josh. Every sale from TikTok needs to go through that link to earn the Amazon Brand Referral Bonus.`
              },
              {
                title: "5. Posting Schedule",
                content: `The system runs on a 5-persona offset rotation. Each week a different persona leads. Over 5 weeks every persona gets equal prominence.\n\nRecommended posting times (Pacific):\n\n7:00–8:00 AM — Commuters / pre-work scroll\n10:00–11:00 AM — Women's wellness discovery window\n12:00–1:00 PM — Highest cross-demographic traffic\n3:00–4:00 PM — Senior audience active window\n6:00–7:00 PM — Post-work educational content peak\n8:00–9:00 PM — Women's wellness prime engagement\n9:30–10:30 PM — Research-minded night scrollers\n\nVideos (bait) go out during peak scroll times. Carousels (anchor) go out during research windows. Never post two pieces back to back — space them across the day.`
              },
              {
                title: "6. Understanding Your Analytics",
                content: `TikTok analytics are pulled automatically into the dashboard — you don't need to enter any numbers manually.\n\nThe Insights tab shows:\n\nSignal Score — a weighted score (2s hold 30% + 6s view 40% + save rate 30%) that predicts which content drives purchases. Higher is better.\n\nPersona Performance Ranking — which of your five buyer profiles is resonating most. Double down on the top performer.\n\nBait/Anchor Health — whether your video reach and carousel saves are growing together. If they're not, the anchor carousel formats need revision.\n\nContent Recommendations — the top 3 content combinations to generate more of, and the bottom 3 to revise or replace.\n\nThe longer data accumulates, the smarter the recommendations get. By month 3 the system will know exactly which persona, format, and hook type drives Lipitrex purchases.`
              },
              {
                title: "7. The Content Genome",
                content: `Every piece of content you generate gets a unique Content ID and attribute tags tracked in the Genome tab.\n\nThe 7 lifecycle stages:\nOrganic — just posted, gathering data\nPaid — promoted with ad spend\nEvergreen — timeless content, no expiration\nCross-Platform — adapted for Instagram or YouTube\nRepurposed — turned into a different format\nTemplated — proven winner, used as a template\nRetired — no longer active\n\nWhen a piece of content consistently performs, advance it to Templated. The Landing Page tab then activates a signal showing how that content's hook language and CTA structure should be applied to your Amazon listing copy.\n\nThis is the compounding layer — your best TikTok content eventually rewrites your Amazon product page in the language your buyers actually use.`
              },
              {
                title: "8. Amazon Attribution & Brand Referral Bonus",
                content: `Amazon Attribution tracks every sale that comes from TikTok.\n\nEvery click on the Linktree bio link is tracked. Every purchase from that click is recorded. Amazon pays a ~10% Brand Referral Bonus on those sales as a credit against your selling fees.\n\nAt $25 average order value, 100 TikTok-attributed sales = $250 back in fee credits.\n\nTo view your data: log into advertising.amazon.com → Measurement & Reporting → Amazon Attribution.\n\nNever change the Linktree URL without coordinating with Josh. The Attribution tag in that URL is what generates the bonus credits.`
              },
              {
                title: "9. Competitive Intelligence",
                content: `The system improves using data from two sources: your own post performance and competitor intelligence from TikTok Creative Center.\n\nTo access competitor data:\n1. Log into business.tiktok.com\n2. Navigate to Creative Center\n3. Filter by: Industry = Dietary Supplements, Region = United States\n4. Review top-performing ads — note hook type, CTR, and keyword signals\n\nKey signals to watch: hooks that open with a pain statement outperform product-first hooks. High-performing supplement ads land their hook at second 2, their problem reveal at second 6, and their solution at second 13.\n\nShare findings with Josh — this data feeds the content genome and improves future performance.`
              },
              {
                title: "10. Platform Access & Responsibilities",
                content: `dashboard.lipitrex.com — managed by Josh. Your action: review and generate content.\nTikTok (progressivehealth1) — managed by both. Your action: post content, monitor comments.\nTikTok Business Center — managed by Josh. Your action: review monthly analytics summary.\nAmazon Seller Central — managed by you. Your action: monitor sales and inventory.\nAmazon Attribution — managed by Josh. Your action: review monthly report from Josh.\nHeyGen — managed by Josh. Your action: none — fully automated.\nPostNitro — managed by Josh. Your action: none — fully automated.\nLinktree — managed by Josh. Your action: do not modify links.\n\nIf something looks wrong with content before posting — reach out to Josh before posting it. If a video doesn't look right, don't post it.\n\nThe goal: Brad reviews, approves, and posts. Everything else is handled.`
              },
              {
                title: "11. Monthly Tool Costs",
                content: `Anthropic API — ~$15–25/mo (AI content generation, usage-based)\nHeyGen — $29/mo (AI avatar video production)\nPostNitro Creator — $25/mo (carousel design)\nPostNitro Embed API — $10/mo (automated carousel generation)\nNetlify — $9/mo (dashboard hosting)\n\nTotal: ~$88–98/month\n\nAll tool costs are reimbursed separately from the retainer. Amazon Brand Referral Bonus earnings offset a meaningful portion of tool costs automatically.`
              },
            ].map((section, i) => (
              <Card key={i} style={{ marginBottom: "12px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: T.gold, marginBottom: "12px" }}>{section.title}</div>
                <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.8, whiteSpace: "pre-line" }}>{section.content}</div>
              </Card>
            ))}

            <div style={{ marginTop: "20px", padding: "16px", background: T.faint, borderRadius: T.radius, border: `1px solid ${T.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: T.muted }}>Lipitrex Content Intelligence Platform · dashboard.lipitrex.com · Prepared by Josh Marks · Harvest Vitality · 2026</div>
            </div>
          </>
        )}

        <div style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: T.subtle }}>
          Lipitrex Content Intelligence Platform · ASIN B08B9SH5XH · FTC Compliant · Amazon Attribution Ready
        </div>
      </div>
    </div>
  );
}
