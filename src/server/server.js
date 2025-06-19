import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import fs from "fs";
import multer from "multer";

import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "/tmp/" });

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
  const audioPath = req.file.path;

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      language: "pt",
    });

    res.join({ transcription: transcription.text });
  } catch (err) {
    console.error("Erro na transcrição de áudio: ", err);
    res.status(500).json({ error: "Erro ao transcrever" });
  } finally {
    fs.unlinkSync(audioPath);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
