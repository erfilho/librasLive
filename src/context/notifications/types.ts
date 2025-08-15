export type NotificationType = "error" | "sucess" | "obs";

export interface Notification {
  message: string;
  type: NotificationType;
  title?: string;
}

export interface NotificationContextType {
  handleError: (error: unknown) => void;
  handleSucess: (message: string, title: string) => void;
  handleObs: (message: string, title: string) => void;
}

export interface NotificationProviderProps {
  autoDismiss?: number;
  defaultErrorTitle?: string;
  defaultSucessTitle?: string;
  children: React.ReactNode;
}
