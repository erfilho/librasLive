import axios from "axios";

const baseUrl = "http://localhost:3001";

const api = axios.create({
  baseUrl,
  timeout: 30000,
});

export default api;
