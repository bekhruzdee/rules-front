// lib/api/users.ts
import { api } from "../api"

export interface User {
  id: number
  username: string
  role: "ADMIN" | "USER"
  created_at: string
  updated_at: string
}

interface GetAllUsersResponse {
  success: boolean
  message: string
  data: User[]
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<GetAllUsersResponse>("/users/all")
  return response.data.data
}
