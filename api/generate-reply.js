import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST request" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a professional freelance web developer.

Reply to this client message in:
1. Friendly style
2. Professional style
3. Short closing reply

Message:
"${message}"
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}