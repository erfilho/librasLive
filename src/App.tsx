import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import NewRecord from "./pages/newrecord";
import NotFound from "./pages/notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/newrecord" element={<NewRecord />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
