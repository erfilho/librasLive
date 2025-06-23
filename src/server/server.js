import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import multer from "multer";

import OpenAI from "openai";


const app = express();

// CORS Setting
app.use(
  cors({
    origin: ["http://localhost:5173", "https://libras-live.web.app/"],
  })
);

// Express setting
app.use(express.json());

// Multer storage setting
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "./tmp");
  },
});

const upload = multer({ storage });

// OpenAI API Key setting
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

// Endpoint for translation of transcribe for best mimes for Libras using the openAI API
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
    console.error("Erro na tradução para Libras: ", err);
    res.status(500).json({ error: "Erro ao traduzir" });
  }
});

// Endpoint for transcribe the audio for text with openAi API
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Erro com o arquivo de áudio" });
  }

  try {
    console.log("Sucessful upload");
  } catch (err) {}
});
