import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/notifications/NotificationProvider";

import AppRoutes from "./routes";

function App() {
  return (
    <NotificationProvider
      autoDismiss={3000}
      defaultErrorTitle="Erro no login!"
      defaultSucessTitle="Sucesso!"
    >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
