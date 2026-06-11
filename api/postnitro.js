export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { slides } = req.body;

    const payload = {
      postType: "CAROUSEL",
      templateId: process.env.POSTNITRO_TEMPLATE_ID,
      brandId: process.env.POSTNITRO_BRAND_ID,
      responseType: "PNG",
      slides: slides,
    };

    const initiateRes = await fetch("https://embed-api.postnitro.ai/post/initiate/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "embed-api-key": process.env.POSTNITRO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const initiateData = await initiateRes.json();

    if (!initiateData.success || !initiateData.data?.embedPostId) {
      return res.status(500).json({ error: "PostNitro initiation failed", detail: initiateData });
    }

    return res.status(200).json({ embedPostId: initiateData.data.embedPostId });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
