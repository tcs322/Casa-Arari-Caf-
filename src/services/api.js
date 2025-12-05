import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Vite
  // baseURL: process.env.VUE_APP_API_URL, // Vue CLI
});

export default api;
