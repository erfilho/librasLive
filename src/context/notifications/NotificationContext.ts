import { createContext } from "react";
import { NotificationContextType } from "./types";

export const NotificationContext = createContext<NotificationContextType>({
  handleError: () => { },
  handleSucess: () => { },
  handleObs: () => { },
});
