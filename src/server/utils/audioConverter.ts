import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { ensureDirectoryExists } from "./fileManager";

// Function to convert an audio File to Mp3
export function convertToMp3(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(outputPath);
    ensureDirectoryExists(outputDir);

    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("error", (err: any) => {
        reject(err);
      })
      .on("end", () => {
        resolve();
      })
      .save(outputPath);
  });
}
