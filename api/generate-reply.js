export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a professional freelance web developer.

Reply to this client message in:
1. Friendly style
2. Professional style
3. Short closing

Message:
${message}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

let reply = "No response";

// Try safe extraction
if (data.candidates && data.candidates.length > 0) {
  const parts = data.candidates[0].content?.parts;
  if (parts && parts.length > 0) {
    reply = parts.map(p => p.text).join("\n");
  }
}

// Handle API errors
if (data.error) {
  reply = "API Error: " + data.error.message;
}

res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}