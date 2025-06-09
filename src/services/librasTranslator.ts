import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function translateToLibras(inputText: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um tradutor de português para Libras. Traduza o texto fornecido para Libras.",
        },
        {
          role: "user",
          content: `Traduza de português para libras, considerando a simplificação de sinais, a seguinte frase: '${inputText}'`,
        },
      ],
      max_tokens: 1000,
    });

    const translatedText = response.choices[0].message?.content || "";
    return translatedText;
  } catch (error) {
    console.error("Erro ao traduzir para Libras:", error);
    throw new Error("Falha na tradução para Libras");
  }
}
