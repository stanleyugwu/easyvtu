import _axios from '../axios';
import {SignInResData} from './auth';

/**
 * Change-password API endpoint request body
 */
type ChangePasswordReqBody = {
  old_password: string;
  password: string;
  password_confirmation: string;
};

/**
 * Change-password API response data type
 */
type ChangePasswordResData = SignInResData;

/**
 * API Service to change user's password
 */
const changePassword = (newPassword: string) => {
  return _axios.post<ChangePasswordReqBody, ChangePasswordResData>(
    '/change_passowrd',
    {
      // BUG: ask for re-write of change password endpoint to remove old_password field
      old_password: newPassword,
      password: newPassword,
      password_confirmation: newPassword,
    },
  );
};

export default changePassword;
