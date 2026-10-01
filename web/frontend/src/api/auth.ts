import { makeRequest } from '@/api/base';
import type { UserType } from '@/types/user';

type LoginResponse = {
  access_token: string;
  token_type: string;
  user_type: string;
  entity_id: string | null;
};

type SignUpRequest = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
};

type SignUpResponse = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
};

export async function loginApi(
  username: string,
  password: string
): Promise<LoginResponse> {
  return makeRequest<LoginResponse>('/user/token', 'POST', {
    username,
    password,
  });
}

export async function signupApi(
  signupData: SignUpRequest
): Promise<SignUpResponse> {
  return makeRequest<SignUpResponse>('/user/', 'POST', signupData);
}
