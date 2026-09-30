import { api } from './client';

// TODO: wire to backend — app/(auth)/signup
export async function signup(email: string, password: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/login
export async function login(email: string, password: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/logout
export async function logout(): Promise<void> {
  // TODO: wire to backend
}

// TODO: wire to backend — app/(auth)/forgot-password
export async function forgotPassword(email: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/forgot-password
export async function resetPassword(token: string, newPassword: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/otp
export async function otpSend(phone: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/otp
export async function otpVerify(phone: string, code: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — Google OAuth callback
export async function googleCallback(code: string): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — token refresh
export async function refreshToken(): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/role-select
export async function selectRole(role: 'candidate' | 'interviewer'): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/candidate/profile-setup
export async function candidateProfileSetup(data: any): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}

// TODO: wire to backend — app/(auth)/interviewer/profile-setup
export async function interviewerProfileSetup(data: any): Promise<any> {
  // TODO: wire to backend
  return {} as any;
}
