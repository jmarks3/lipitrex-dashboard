// Polls HeyGen for the render status of a video. The frontend calls this on an
// interval until the status is "completed", at which point video_url is set.
//   GET /.netlify/functions/heygen-status?video_id=<id>
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const video_id = event.queryStringParameters?.video_id;
  if (!video_id) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing video_id query parameter" }),
    };
  }

  try {
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(video_id)}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.HEYGEN_API_KEY,
        },
      },
    );

    const data = await response.json();
    const status = data.data?.status || data.status;
    const video_url = data.data?.video_url || data.video_url || null;

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ status, video_url, video_id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
