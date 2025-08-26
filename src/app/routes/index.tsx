import { Route, Routes } from "react-router-dom";

import Dashboard from "../../pages/Dashboard";
import Login from "../../pages/Login";
import NewRecord from "../../pages/NewRecord";
import NotFound from "../../pages/NotFound";
import Player from "../../pages/Player";
import Register from "../../pages/Register";
import Settings from "../../pages/Settings";

import PrivateRoute from "./PrivateRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/newrecord"
        element={
          <PrivateRoute>
            <NewRecord />
          </PrivateRoute>
        }
      />
      <Route
        path="/player"
        element={
          <PrivateRoute>
            <Player />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
