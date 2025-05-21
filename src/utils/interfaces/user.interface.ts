export interface IOtherUserProfile {
  avatar: string;
  badge: string;
  bio: string;
  birth_date: string;
  chat_mute_date: string;
  chat_mute_status: string;
  created_at: string;
  email: string;
  email_verification: boolean;
  followers: number;
  following: number;
  id: string;
  label: string;
  name: string;
  password: string;
  phone_number: string;
  pin: boolean;
  posts: number;
  preferred_currency: string;
  preferred_language: string;
  ref_code: string;
  region: string;
  role: string;
  seeds_tag: string;
  status_blocked: boolean;
  status_followed: boolean;
  status_online: boolean;
  total_exp: number;
  updated_at: string;
  verified: boolean;
}

export interface SearchUserParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type PreferredCurrencyI =
  | 'eur'
  | 'gbp'
  | 'idr'
  | 'jpy'
  | 'myr'
  | 'php'
  | 'sgd'
  | 'thb'
  | 'usd'
  | 'vnd';

export interface UserInfo {
  id: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  preferredLanguage: string;
  preferredCurrency: string;
  bio: string;
  pin: boolean;
  followers: number;
  following: number;
  posts: number;
  region: string;
  verified: boolean;
  email_verification: boolean;
  badge: string;
  claims: Claims;
  refCodeUsage: number;
  label: string;
  currentExp: number;
  isPasswordExists: boolean;
}

export interface Claims {
  sub: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  role: string;
  preferredLanguage: string;
  preferredCurrency: string;
  iss: string;
  aud: string[];
  exp: number;
  nbf: number;
  iat: number;
}
