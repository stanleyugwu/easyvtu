import _axios from '../axios';

export type SignInReqBody = Record<'email' | 'password', string>;
export type SignInResData = {
  id: number;
  unique_id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  image?: string;
  email_verified_at?: string;
  isVerified: string;
  isAdmin: string;
  refer_by?: string;
  wallet_balance: string;
  account_number?: string;
  account_name?: string;
  bank_name?: string;
  no_of_referrals: number;
  created_at: string;
  updated_at: string;
};

/**
 * Handles signing in user
 */
const signIn = (email: string, password: string) => {
  return _axios.post<
    SignInReqBody,
    SignInResData & {
      access_token: string;
      token_type: 'bearer';
      expires_in: number;
    }
  >('/login', {email, password});
};

export type SignUpReqBody = Record<
  'username' | 'email' | 'password' | 'phone' | 'password_confirmation',
  string
>;
export type SignUpResData = {
  username: string;
  email: string;
  phone: string;
  unique_id: string;
  updated_at: string;
  created_at: string;
};

/**
 * Handles sign up
 */
const signUp = async (
  username: string,
  email: string,
  password: string,
  phone: string,
) => {
  return _axios.post<SignUpReqBody, SignUpResData>('/register', {
    username,
    email,
    password,
    phone,
    password_confirmation: password,
  });
};

export {signIn, signUp};
