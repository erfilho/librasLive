import { useState } from "react";

import { NotificationContext } from "./NotificationContext";
import { NotificationHandler } from "../../components/NotificationHandler";

import {
  NotificationProviderProps,
  NotificationType,
  Notification,
} from "./types";

export const NotificationProvider = ({
  children,
  ...props
}: NotificationProviderProps) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (
    message: string,
    type: NotificationType,
    title?: string
  ) => {
    setNotification({
      message,
      type,
      title:
        title ||
        (type == "error" ? props.defaultErrorTitle : props.defaultSucessTitle),
    });
  };

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
    showNotification(errorMessage, "error");
  };

  const handleSucess = (message: string, title?: string) => {
    showNotification(message, "sucess", title);
  };

  const handleObs = (message: string, title?: string) => {
    showNotification(message, "obs", title)
  }

  return (
    <NotificationContext.Provider value={{ handleError, handleSucess, handleObs }}>
      {children}
      <NotificationHandler
        notification={notification}
        setNotification={setNotification}
        {...props}
      />
    </NotificationContext.Provider>
  );
};
