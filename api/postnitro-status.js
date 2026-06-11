export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { embedPostId } = req.query;
  if (!embedPostId) return res.status(400).json({ error: "embedPostId required" });

  try {
    const statusRes = await fetch(`https://embed-api.postnitro.ai/post/status/${embedPostId}`, {
      headers: { "embed-api-key": process.env.POSTNITRO_API_KEY },
    });
    const statusData = await statusRes.json();
    const status = statusData.data?.embedPost?.status;

    if (status === "COMPLETED") {
      const outputRes = await fetch(`https://embed-api.postnitro.ai/post/output/${embedPostId}`, {
        headers: { "embed-api-key": process.env.POSTNITRO_API_KEY },
      });
      const outputData = await outputRes.json();
      return res.status(200).json({ status: "COMPLETED", images: outputData.data?.result?.data || [] });
    }

    if (status === "FAILED") {
      return res.status(200).json({ status: "FAILED" });
    }

    return res.status(200).json({ status: status || "PENDING" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
