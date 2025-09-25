import { Route, Routes } from "react-router-dom";

import Dashboard from "../../pages/dashboard";
import Login from "../../pages/login";
import NewRecord from "../../pages/newrecord";
import NotFound from "../../pages/notfound";
import Player from "../../pages/player";
import Register from "../../pages/register";
import Settings from "../../pages/settings";

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
