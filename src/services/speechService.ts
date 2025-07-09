async function translateText(text: string): Promise<string> {
  // const response = await fetch("https://libraslive.onrender.com/translate", {
  const response = await fetch("http://localhost:3001/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  const translation: string = data.translation;

  return translation;
}

async function transcribeText(formData: FormData) {
  //const res = await fetch("https://libraslive.onrender.com/transcribe", {
  const response = await fetch("http://localhost:3001/transcribe", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  const transcription = data.transcription;

  console.log(transcription);

  return transcription;
}

export { transcribeText, translateText };
