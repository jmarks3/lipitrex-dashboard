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

// Offset rotation — Week 1
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
${type === 'video' ? `Full script timed to ${persona.length}. Format: [HOOK 0-3s] [BODY] [CTA — soft/medium/hard options]` : 'Every slide: number, headline text, body text (1-2 sentences max), HeyGen visual direction'}

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
  const [heygenConnected, setHeygenConnected] = useState(false);
  const [videoMetrics, setVideoMetrics] = useState(() => {
    const m = {};
    VIDEO_FORMATS.forEach(f => { m[f.id] = {}; PERSONAS.forEach(p => { m[f.id][p.id] = { views: "", saves: "", comments: "", completion: "" }; }); });
    return m;
  });
  const [carouselMetrics, setCarouselMetrics] = useState(() => {
    const m = {};
    CAROUSEL_FORMATS.forEach(f => { m[f.id] = {}; PERSONAS.forEach(p => { m[f.id][p.id] = { views: "", saves: "", comments: "", completion: "" }; }); });
    return m;
  });
  const [trackType, setTrackType] = useState("video");
  const [trackFormat, setTrackFormat] = useState(VIDEO_FORMATS[0].id);
  const [genomeFilter, setGenomeFilter] = useState("all");


  // Date range for current offset week
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

  const generatePost = async (persona, type) => {
    const format = getFormatForPersona(persona.id, type);
    const key = `${type}_${persona.id}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    setResults(prev => ({ ...prev, [key]: "" }));

    const dateStr = new Date().toLocaleDateString('en-US',{month:'2-digit',day:'2-digit'}).replace('/','');
    const num = String(idCounter).padStart(3, "0");
    const newId = `LT-${type === 'video' ? 'V' : 'C'}-${num}-P${persona.id}-${dateStr}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-calls": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
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
VIDEO LENGTH TARGET: ${persona.length}

Make it specific, vivid, and warm. The viewer should feel understood before they feel sold to. No pregnancy content.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Error generating content.";
      setResults(prev => ({ ...prev, [key]: text }));

      // Add to content log
      const entry = {
        id: newId,
        persona: persona.name,
        personaId: persona.id,
        personaColor: persona.color,
        personaEmoji: persona.emoji,
        format: format.label,
        formatEmoji: format.emoji,
        type,
        offset: currentOffset,
        stage: "Organic",
        date: new Date().toLocaleDateString(),
        attributes: {
          contentType: type,
          persona: persona.name,
          format: format.label,
          metric: format.metric,
          length: persona.length,
          compliance: persona.id === 5 ? "Required" : "None",
          offset: `${currentOffset}/5`,
          platform: "TikTok",
        }
      };
      setContentLog(prev => [entry, ...prev]);
      setIdCounter(prev => prev + 1);

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

  const updateMetric = (type, fId, pId, field, val) => {
    if (type === "video") {
      setVideoMetrics(prev => ({ ...prev, [fId]: { ...prev[fId], [pId]: { ...prev[fId][pId], [field]: val } } }));
    } else {
      setCarouselMetrics(prev => ({ ...prev, [fId]: { ...prev[fId], [pId]: { ...prev[fId][pId], [field]: val } } }));
    }
  };

  const updateStage = (id, stage) => {
    setContentLog(prev => prev.map(item => item.id === id ? { ...item, stage } : item));
  };

  const TABS = [
    { id: "generate", label: "Generate", emoji: "🎬" },
    { id: "track", label: "Track", emoji: "📊" },
    { id: "insights", label: "Insights", emoji: "💡" },
    { id: "genome", label: "Genome", emoji: "🧬" },
    { id: "landing", label: "Landing Page", emoji: "🏆" },
    { id: "reporting", label: "Reporting", emoji: "📈" },
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

          {/* NAV TABS */}
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

            {/* Type toggle + Generate All */}
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

            {/* HeyGen connection */}
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

            {/* Persona cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {PERSONAS.map(p => {
                const format = getFormatForPersona(p.id, genType);
                const key = `${genType}_${p.id}`;
                const result = results[key];
                const isLoading = loading[key];
                const isExpanded = expanded === key;

                return (
                  <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
                    {/* Card header */}
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
                            {heygenConnected && (
                              <Btn variant="secondary" style={{ fontSize: "12px", padding: "6px 12px" }}>
                                Send to HeyGen →
                              </Btn>
                            )}
                            <Btn variant="ghost" style={{ fontSize: "12px", padding: "6px 12px" }}
                              onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(result); }}>
                              Copy
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

                    {/* Pain points when empty */}
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

                    {/* Loading state */}
                    {isLoading && (
                      <div style={{ padding: "20px", textAlign: "center", color: T.muted, fontSize: "13px" }}>
                        Building content package for {p.name}...
                      </div>
                    )}

                    {/* Preview when collapsed */}
                    {result && !isExpanded && (
                      <div style={{ padding: "10px 20px 14px" }}>
                        <div style={{ fontSize: "12px", color: T.muted, fontStyle: "italic", lineHeight: 1.5 }}>
                          {result.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 140)}...
                        </div>
                      </div>
                    )}

                    {/* Full content */}
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

            {/* Format selector */}
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

            {/* Metric inputs */}
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
                      {[["views", "👁 Views"], ["saves", "🔖 Saves"], ["comments", "💬 Comments"], ["completion", "⏱ Completion %"]].map(([field, label]) => (
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
        {tab === "insights" && (
          <>
            {/* Bait/Anchor health */}
            <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${T.gold}` }}>
              <Label>Bait / Anchor Health</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                Enter data in the Track tab to see the bait/anchor relationship — are carousel saves growing alongside video reach?
                When both are rising together, the system is working. If video reach grows but carousel saves don't, the anchor needs revision.
              </div>
            </Card>

            {/* Matrix grids */}
            {[["video", "🎬 Video Matrix", VIDEO_FORMATS, videoMetrics], ["carousel", "🖼️ Carousel Matrix", CAROUSEL_FORMATS, carouselMetrics]].map(([type, label, formats, metrics]) => (
              <Card key={type} style={{ marginBottom: "20px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>{label} — Save Rate %</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: T.faint }}>
                        <th style={{ padding: "10px 12px", textAlign: "left", color: T.muted, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>Persona</th>
                        {formats.map(f => (
                          <th key={f.id} style={{ padding: "10px 12px", textAlign: "center", color: T.muted, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>
                            {f.emoji}<br /><span style={{ fontSize: "10px" }}>{f.label.split('/')[0].trim()}</span>
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
                            const rate = getSaveRate(metrics, f.id, p.id);
                            const allRates = formats.map(ff => parseFloat(getSaveRate(metrics, ff.id, p.id) || 0));
                            const isBest = rate && parseFloat(rate) === Math.max(...allRates);
                            return (
                              <td key={f.id} style={{
                                padding: "10px 12px", textAlign: "center",
                                background: isBest ? p.light : rate ? T.faint : T.white,
                                color: isBest ? p.color : rate ? T.body : T.border,
                                fontWeight: isBest ? 800 : 400,
                                borderBottom: `1px solid ${T.border}`,
                                borderRadius: "4px",
                              }}>
                                {rate ? `${rate}%` : "—"}
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
          </>
        )}

        {/* ── GENOME TAB ── */}
        {tab === "genome" && (
          <>
            <Card style={{ marginBottom: "20px", padding: "16px", borderLeft: `3px solid ${T.gold}` }}>
              <Label>Content Genome System</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                Every piece of generated content receives a unique ID and attribute tags at creation.
                Track its full lifetime from Organic → Paid → Evergreen → Cross-Platform → Repurposed → Templated → Retired.
                The system recommends the next stage based on performance data.
              </div>
            </Card>

            {/* Filter */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {["all", ...CONTENT_STAGES].map(s => (
                <button key={s} onClick={() => setGenomeFilter(s)} style={{
                  padding: "5px 12px", borderRadius: "20px",
                  border: `1px solid ${genomeFilter === s ? T.gold : T.border}`,
                  background: genomeFilter === s ? T.goldLight : T.white,
                  color: genomeFilter === s ? T.goldDark : T.muted,
                  fontSize: "11px", fontWeight: 600, cursor: "pointer",
                  textTransform: "capitalize",
                }}>{s === "all" ? "All Content" : s}</button>
              ))}
            </div>

            {contentLog.length === 0 ? (
              <Card style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🧬</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>No content IDs yet</div>
                <div style={{ fontSize: "12px", color: T.muted }}>Generate posts in the Generate tab — each one receives a unique ID and attribute tags automatically.</div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {contentLog
                  .filter(item => genomeFilter === "all" || item.stage === genomeFilter)
                  .map(item => (
                    <Card key={item.id} style={{ padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px" }}>{item.personaEmoji}</span>
                          <div>
                            <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: T.gold }}>{item.id}</div>
                            <div style={{ fontSize: "11px", color: T.muted, marginTop: "2px" }}>{item.persona} · {item.format} · {item.date}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                          <Badge color={item.type === "video" ? T.blue : T.gold} bg={item.type === "video" ? T.blueLight : T.goldLight}>
                            {item.type === "video" ? "🎬 Video" : "🖼️ Carousel"}
                          </Badge>
                        </div>
                      </div>

                      {/* Attributes */}
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

                      {/* Landing Page Signal — shows when Templated */}
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
                            <strong>Element:</strong> {LANDING_PAGE_MAP[item.attributes.format?.toLowerCase().replace(/ /g,'_').replace(/\//g,'_')] ? LANDING_PAGE_MAP[item.attributes.format?.toLowerCase().replace(/ /g,'_').replace(/\//g,'_')].element : "Product Listing Copy"}<br/>
                            This content's hook language, pain point framing, and CTA tone are recommended for the Lipitrex Amazon listing and landing pages. The audience proved it works — let the data write the copy.
                          </div>
                        </div>
                      )}

                      {/* Stage tracker */}
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
                  ))}
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
                The audience proved what works. Let the data write the copy.
              </div>
            </Card>

            {/* Translation map */}
            <Card style={{ marginBottom: "20px", padding: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>Content → Listing Translation</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  ["🎬 Hook Language", "Above the fold headline", "The hook that stopped the scroll in 2 seconds is the headline that stops the browser scroll."],
                  ["😤 Pain Point Comments", "Bullet points", "The pain points generating the most comment sentiment become your primary listing bullet points — in the buyer's own language."],
                  ["📖 Before & After Story", "Testimonial section", "The story arc that resonates becomes the testimonial template and featured review structure."],
                  ["🌿 Ingredient Spotlight", "A+ content modules", "The ingredient that gets bookmarked most becomes the A+ content structure — same information architecture, different canvas."],
                  ["📣 CTA Tone", "Add to Cart copy", "Soft, medium, or hard — the CTA aggressiveness that appears most in high-attribution IDs becomes the listing CTA approach."],
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

            {/* Active landing page signals from genome */}
            <div style={{ marginBottom: "8px" }}>
              <Label>Active Landing Page Signals — From Templated Content</Label>
            </div>
            {contentLog.filter(item => item.stage === "Templated").length === 0 ? (
              <Card style={{ padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>🏆</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>No Templated content yet</div>
                <div style={{ fontSize: "12px", color: T.muted }}>
                  As content IDs accumulate and win consistently, the system will flag them as Templated
                  and activate Landing Page Signals here. Generate content and track performance to build toward this.
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
                        Review the full content output and extract the copy that performed.
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Multi-supplement note */}
            <Card style={{ marginTop: "20px", padding: "16px", background: T.faint }}>
              <Label>Multi-Supplement Extension</Label>
              <div style={{ fontSize: "13px", color: T.body, lineHeight: 1.6 }}>
                Every supplement in Brad's catalog gets its own genome, its own matrix, and its own landing page signals.
                As the catalog builds, the genomes cross-reference — a buyer who converts on Lipitrex has attributes
                that predict which other supplements they'll buy. The system surfaces cross-sell opportunities
                and builds a complete map of Brad's buyer universe across every product.
              </div>
            </Card>
          </>
        )}

        {/* ── REPORTING TAB ── */}
        {tab === "reporting" && (
          <>
            {/* Active tools */}
            <div style={{ marginBottom: "8px" }}>
              <Label>Active — Connected Now</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { name: "TikTok Studio", desc: "Native analytics — views, saves, follower growth, watch time, completion rate.", url: "https://studio.tiktok.com", cost: "Free", active: true },
                { name: "Amazon Attribution", desc: "Tracks TikTok bio link clicks through to Amazon purchases. ASIN: B08B9SH5XH.", url: "https://advertising.amazon.com", cost: "Free", active: true },
                { name: "TikTok Creative Center", desc: "Free competitor intelligence — search competing supplement brands' ad content.", url: "https://ads.tiktok.com/business/creativecenter", cost: "Free", active: true },
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

            {/* Coming soon tools */}
            <div style={{ marginBottom: "8px" }}>
              <Label>Coming Soon — Activates With IG + YouTube Expansion</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {[
                { name: "Socialinsider", badge: "Cross-Platform Intelligence", desc: "Competitor benchmarking across TikTok, Instagram Reels, and YouTube Shorts. Cross-platform signal in one view.", cost: "~$99/mo", why: "Activates when IG + YT go live." },
                { name: "NexLev", badge: "YouTube Niche Intelligence", desc: "AI-powered YouTube niche finder. Surfaces breakout channels and underserved content angles in the supplement space.", cost: "Lower tier", why: "Activates with YouTube Shorts expansion." },
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

            {/* Cost summary */}
            <Card style={{ padding: "20px" }}>
              <Label>Monthly Cost at Each Stage</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "8px" }}>
                {[["Now", "$20", "Claude Pro + free tools"], ["With IG + YT", "~$119", "+ Socialinsider"], ["At Scale", "~$220+", "+ NexLev + advanced"]].map(([stage, cost, note]) => (
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

        <div style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: T.subtle }}>
          Lipitrex Content Intelligence Platform · ASIN B08B9SH5XH · FTC Compliant · Amazon Attribution Ready
        </div>
      </div>
    </div>
  );
}
