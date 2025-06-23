import express from "express";
import multer from "multer";

import { openai } from "../config/openai";

import { convertToMp3 } from "../utils/audioConverter";
import { changeFileExtension, deleteFile } from "../utils/fileManager";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./tmp",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file was sent!" });
    return;
  }

  const inputPath = req.file.path;
  const outputPath = changeFileExtension(inputPath, ".mp3");

  try {
    await convertToMp3(inputPath, outputPath);

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(outputPath),
    });

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error(`Error on transcription! `, error);
    res.status(500).json({ error: "Error on transcription!" });
  } finally {
    deleteFile(inputPath);
    deleteFile(outputPath);
  }
});
