const AVATAR_MAP = {
  1: "7df7e12eb8e748b6bedb114952ea10f3",  // P1 Seniors - Helen
  2: "35f031398d8c4ccbb782f901b8672057",  // P2 Weight-Related - Keisha
  3: "b8667ec621694dd09fad27edddc69095",  // P3 Hormonal - Diana
  4: "fe725cca05984c4a81fcb82f2995bded",  // P4 Nine-to-Five - Benjamin
  5: "11f546c2fbe54d31a58bf691bd9561de",  // P5 Rx Side Effects - Diane
};

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { script, personaId, genomeId } = JSON.parse(event.body);
    const avatarId = AVATAR_MAP[personaId];

    if (!avatarId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: `No avatar found for persona ${personaId}` }) 
      };
    }

    const response = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.HEYGEN_API_KEY,
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: script,
          },
          background: {
            type: "color",
            value: "#ffffff",
          },
        }],
        dimension: {
          width: 1080,
          height: 1920,
        },
        title: genomeId || "Lipitrex Video",
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message }) 
    };
  }
};
