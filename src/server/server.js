// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um tradutor de português para Libras. A sua resposta será usada no vLibras para exibir em tempo real, retorne somente as palavras traduzidas, sem explicações ou contexto adicional.",
        },
        {
          role: "user",
          content: `Traduza de português para libras, considerando a simplificação de sinais, a seguinte frase: '${text}' e me retorne somente a sequência de palavras, sem ordem, pontuação, significados ou explicações adicionais.`,
        },
      ],
    });

    res.json({ translation: response.choices[0].message.content });
  } catch (err) {
    console.error("Erro na API do OpenAI:", err);
    res.status(500).json({ error: "Erro ao traduzir" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
