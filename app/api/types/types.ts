export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  refresh: string;
  access: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface LoginResponse {
  status: string;    
  message: string;
  data?: LoginResponseData;
}


export interface ProfilePictureData {
  profile_picture: string | null;
}

export interface ProfilePictureResponse {
  status: string;
  message: string;
  data: ProfilePictureData;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponseData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

export interface SignupResponse {
  status: string; 
  message: string;
  data?: SignupResponseData;
}

export interface UserProfile {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    date_joined: string;
  };
  profile_picture: string | null;
  userBio: string;
}

export interface ProfileUpdateRequest {
  profile_picture?: File;
  userBio?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data?: UserProfile;
}

export interface ApiError {
  detail?: string;
  message?: string;
  status?: string;
}