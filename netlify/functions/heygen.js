const AVATAR_MAP = {
  1: { avatar_id: "7df7e12eb8e748b6bedb114952ea10f3", voice_id: "CYfjBekN6oUM2D7pDDix" },        // P1 Seniors - Helen
  2: { avatar_id: "35f031398d8c4ccbb782f901b8672057", voice_id: "17b422ec8f0143538789ba38053cd298" }, // P2 Weight-Related - Keisha
  3: { avatar_id: "b8667ec621694dd09fad27edddc69095", voice_id: "2cca78e72130452a838ade24cd551294" }, // P3 Hormonal - Diana
  4: { avatar_id: "fe725cca05984c4a81fcb82f2995bded", voice_id: "15a161960c5c468cb4da4838fd561e0c" }, // P4 Nine-to-Five - Benjamin
  5: { avatar_id: "11f546c2fbe54d31a58bf691bd9561de", voice_id: "3f7ca79fa7ce4957a418feab29a3b3a0" }, // P5 Rx Side Effects - Diane
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
    const persona = AVATAR_MAP[Number(personaId)];

    if (!persona) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `No avatar found for persona ${personaId}` }),
      };
    }

    console.log(script.slice(0, 500));

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
            avatar_id: persona.avatar_id,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: persona.voice_id,
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
      body: JSON.stringify({ error: err.message }),
    };
  }
};
