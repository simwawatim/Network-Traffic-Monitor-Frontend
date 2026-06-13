import apiClient from "../base/apiClient";
import { ProfilePictureResponse, ProfileResponse, ProfileUpdateRequest } from "../types/types";

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


export async function getProfile(): Promise<ProfileResponse> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const response = await apiClient.get<ProfileResponse>('/api/v1/user/profile/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<ProfileResponse> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const formData = new FormData();
  if (data.profile_picture) formData.append('profile_picture', data.profile_picture);
  if (data.userBio) formData.append('userBio', data.userBio);
  if (data.first_name) formData.append('first_name', data.first_name);
  if (data.last_name) formData.append('last_name', data.last_name);
  if (data.email) formData.append('email', data.email);
  if (data.username) formData.append('username', data.username);
  
  const response = await apiClient.patch<ProfileResponse>('/api/v1/user/profile/', formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}