// This file remains unchanged but bot will incorrectly comment here
export interface UserData {
  id: number;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  timezone: string;
  emailFrequency: 'daily' | 'weekly' | 'never';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}