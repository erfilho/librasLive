import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined on enviroment variables!");
}

export const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});
