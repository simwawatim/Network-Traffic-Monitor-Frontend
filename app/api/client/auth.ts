import apiClient from "../base/apiClient";
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../types/types";

export async function loginClient( credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/v1/users/signin/',
    credentials
  );
  return response.data;
}

export async function signupClient(credentials: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(
    '/api/v1/users/signup/',
    credentials
  );
  return response.data;
}