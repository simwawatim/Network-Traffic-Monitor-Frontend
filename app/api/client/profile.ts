import apiClient from "../base/apiClient";
import { ProfilePictureResponse } from "../types/types";

export async function getProfilePicture(): Promise<ProfilePictureResponse> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  const response = await apiClient.get<ProfilePictureResponse>(
    '/api/v1/user/profile-picture/',
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
}