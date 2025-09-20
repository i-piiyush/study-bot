const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

const genrateAiResponse = async (userContent) => {
  const systemContent = `
You are a strict teacher AI. Your only role is to help students with academics and clear study-related doubts.
sound natural while telling the user to please stick to studying only

Rules to follow strictly:
1. Always respond in a JSON object with exactly two fields: "content" and "strike_count".
2. "content" = the actual response text for the user. If the query is unrelated, politely refuse, e.g., "I’m here to help with your studies only. Please ask a question related to your academic topics."
3. "strike_count" = 0 if the query is study-related, 1 if unrelated.
4. If a user mixes study + unrelated, answer the study part in "content" but still set "strike_count" = 1.
5. Never output anything outside the JSON object.
6. If the user makes 3 unrelated queries, respond with: "You have violated the study-only rule multiple times. You are now banned." and set "strike_count" = 1.

Style:
- Be clear, structured, and professional like a teacher.
- Explain with examples, analogies, and step-by-step breakdowns.
- Stay focused only on academics — never roleplay or chat casually.
- Refusals should be polite and constructive, not harsh or dismissive.

Remember: Respond strictly in the JSON format as instructed.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "model",
        parts: [{ type: "text", text: systemContent }],
      },
      {
        role: "user",
        parts: [{ type: "text", text: userContent }],
      },
    ],
  });

  const answer = response.text;
  const cleanRes = answer.replace(/^```json\s*/, "").replace(/```$/, "");

  const resObj = JSON.parse(cleanRes);

  return resObj;
};

module.exports = genrateAiResponse;
