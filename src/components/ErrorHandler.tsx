import { useState, useEffect } from "react";
import { AlertsPopups } from "./AlertsPopups";

interface ErrorHandlerProps {
  autoDismiss?: number;
  defaultTitle?: string;
}

const ErrorHandler = ({
  autoDismiss = 5000,
  defaultTitle = "Erro!",
}: ErrorHandlerProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "Unknown error has ocurried!";
    }

    console.error("Error: ", errorMessage);
    setError(errorMessage);
  };

  useEffect(() => {
    if (error && autoDismiss > 0) {
      const timer = setTimeout(() => setError(null), autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [error, autoDismiss]);

  return (
    <>
      {error && (
        <AlertsPopups
          key={Date.now()}
          title={defaultTitle}
          type="error"
          message={error}
        />
      )}
    </>
  );
};

export const useErrorHandler = () => {
  const [_, setHandler] = useState<((error: unknown) => void) | null>(null);

  return (error: unknown) => {
    setHandler(() => (e: unknown) => {
      throw e;
    });
    setHandler(null);
  };
};

export default ErrorHandler;
