import app from "./app";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.port || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
