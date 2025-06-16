import { api } from "@/lib/api";

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
