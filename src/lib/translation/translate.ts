import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const GLOSSARY = `
- Preserve verbatim (do NOT translate): all Arabic script, Qur'anic verses, hadith
  quotations, and transliterations like "Hijama", "Sunnah", "Ruqyah", "Nabidh".
- Keep brand name "Sunnah Remedies" unchanged.
- "Prophetic Medicine" → "Profetisk medicin".
- Maintain a respectful, precise, luxury-healthcare register (not casual).
- Do not end visible text with a full stop (period).
`;

export async function translateToDanish(input: {
  title?: string;
  excerpt?: string;
  bodyJson?: unknown;
}): Promise<{ title?: string; excerpt?: string; bodyJson?: unknown }> {
  if (!process.env.ANTHROPIC_API_KEY) return {};

  const model =
    process.env.ANTHROPIC_TRANSLATION_MODEL ?? "claude-sonnet-4-20250514";

  const system = `You are a professional EN→DA (Danish) translator specialising in
healthcare and Islamic Prophetic-medicine content. Translate faithfully and idiomatically.
${GLOSSARY}
Return ONLY valid JSON matching the input shape. Do not add commentary.`;

  try {
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: [
        {
          role: "user",
          content: `Translate the following JSON values from English to Danish, keeping keys and structure identical:\n\n${JSON.stringify(input)}`,
        },
      ],
    });

    const text = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    return JSON.parse(text);
  } catch {
    return {};
  }
}
