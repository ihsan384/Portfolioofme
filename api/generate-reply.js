import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a professional freelance web developer.

Reply in:
1. Friendly
2. Professional
3. Short closing

Message:
${message}
              `,
            },
          ],
        },
      ],
    });

    const text = result.response.text();

    res.status(200).json({ reply: text });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}