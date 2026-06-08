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
    console.log("PostNitro initiate response:", JSON.stringify(initiateData));

    if (!initiateData.success || !initiateData.data?.embedPostId) {
      return res.status(500).json({ error: "PostNitro initiation failed", detail: initiateData });
    }

    const embedPostId = initiateData.data.embedPostId;

    // Poll for completion
    let completed = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const statusRes = await fetch(`https://embed-api.postnitro.ai/post/status/${embedPostId}`, {
        headers: { "embed-api-key": process.env.POSTNITRO_API_KEY },
      });
      const statusData = await statusRes.json();
      console.log(`Poll ${i + 1} status:`, statusData.data?.embedPost?.status);
      if (statusData.data?.embedPost?.status === "COMPLETED") {
        completed = true;
        break;
      }
      if (statusData.data?.embedPost?.status === "FAILED") {
        return res.status(500).json({ error: "PostNitro generation failed", detail: statusData });
      }
    }

    if (!completed) return res.status(500).json({ error: "Timed out waiting for carousel" });

    // Fetch output
    const outputRes = await fetch(`https://embed-api.postnitro.ai/post/output/${embedPostId}`, {
      headers: { "embed-api-key": process.env.POSTNITRO_API_KEY },
    });
    const outputData = await outputRes.json();
    console.log("PostNitro output:", JSON.stringify(outputData));

    return res.status(200).json(outputData);

  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
