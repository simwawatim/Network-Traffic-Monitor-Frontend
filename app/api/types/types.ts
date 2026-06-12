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

export interface ApiError {
  detail?: string;
  message?: string;
  status?: string;
}