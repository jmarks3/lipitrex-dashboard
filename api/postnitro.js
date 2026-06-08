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

    if (!initiateData.requestId) {
      return res.status(500).json({ error: "No requestId returned", detail: initiateData });
    }

    // Poll for completion
    const requestId = initiateData.requestId;
    let result = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await fetch(`https://embed-api.postnitro.ai/post/request-status/${requestId}`, {
        headers: { "embed-api-key": process.env.POSTNITRO_API_KEY },
      });
      const statusData = await statusRes.json();
      if (statusData.status === "COMPLETED") {
        result = statusData;
        break;
      }
      if (statusData.status === "FAILED") {
        return res.status(500).json({ error: "PostNitro generation failed", detail: statusData });
      }
    }

    if (!result) return res.status(500).json({ error: "Timed out waiting for carousel" });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
