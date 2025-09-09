import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useApi() {
  const { token } = useContext(AuthContext);
  const api = axios.create({
    baseURL: process.env.baseURL || "http://localhost:3001",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return api;
}
