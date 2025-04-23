import React, { useState, useEffect } from "react";

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "pt-BR";

  useEffect(() => {
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = () => {
    setText("");
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
  };
};

const SpeechComponent: React.FC = () => {
  const { text, isListening, startListening, stopListening } =
    useSpeechRecognition();

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <p>{text}</p>
    </div>
  );
};

export default SpeechComponent;
