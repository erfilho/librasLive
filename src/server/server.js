import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import fs from "fs";
import multer from "multer";
import mime from "mime-types";
import ffmpeg from "fluent-ffmpeg";

import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors(["http://localhost:5173", "https://libras-live.web.app/"]));

app.use(express.json());

import open from "open";

const storage = multer.diskStorage({
  destination: "C:/temp/",
  filename: (req, file, cb) => {
    let ext = mime.extension(file.mimetype) || ".webm";
    if (ext === "weba") {
      ext = "webm";
    }
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

function convertToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("error", (err) => {
        console.error("Erro na conversão: ", err.message);
        reject(err);
      })
      .on("end", () => {
        console.log("Conversão finalizada!");
        resolve();
      })
      .save(outputPath);
  });
}

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

  const audioPath = req.file.path;

  const audioMp3Path = audioPath.replace(/\.\w+$/, ".mp3");

  await convertToMp3(audioPath, audioMp3Path);

  console.log(audioPath, "caminho do audio");

  try {
    console.log("Mimetype:", req.file.mimetype);
    console.log("Nome do arquivo salvo:", audioPath);

    const result = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(audioMp3Path),
    });

    await console.log(result);
  } catch (err) {
    console.error("Erro na transcrição de áudio: ", err);
    res.status(500).json({ error: "Erro ao transcrever" });
  } finally {
    fs.unlinkSync(audioPath, (err) => {
      if (err) console.error("Erro ao deletar arquivo temporário! ", err);
    });
    fs.unlinkSync(audioMp3Path, (err) => {
      if (err) console.error("Erro ao deletar arquivo temporário! ", err);
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
