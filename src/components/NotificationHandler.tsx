import { useEffect } from "react";
import { AlertsPopups } from "./AlertsPopups";

import type { Notification } from "../context/notifications/types";

interface NotificationHandlerProps {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  autoDismiss?: number;
}

export const NotificationHandler = ({
  notification,
  setNotification,
  autoDismiss = 5000,
}: NotificationHandlerProps) => {
  useEffect(() => {
    if (notification && autoDismiss > 0) {
      const timer = setTimeout(() => setNotification(null), autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [notification, autoDismiss, setNotification]);

  if (!notification) return null;

  return (
    <AlertsPopups
      key={Date.now()}
      title={notification.title}
      type={notification.type}
      message={notification.message}
    />
  );
};
