/*
  Appellation: types <auth>
  Contrib: @FL03
*/

export type AuthView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'confirm';

export enum AuthGateState {
  Login = 'login',
  Register = 'register',
  ForgotPassword = 'forgot-password',
  ResetPassword = 'reset-password',
  Confirm = 'confirm',
  
}