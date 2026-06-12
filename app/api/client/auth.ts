import apiClient from "../base/apiClient";
import { LoginRequest, LoginResponse } from "../types/types";

export async function loginClient( credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/v1/users/signin/',
    credentials
  );
  return response.data;
}