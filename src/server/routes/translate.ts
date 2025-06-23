import express from "express";

import { openai } from "../config/openai";

const router = express.Router();

router.post("/", async (req, res) => {
  const text = req.body;

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
    console.error("Error on Libras translation! ", err);
    res.status(500).json({ error: "Error on translation!" });
  }
});
