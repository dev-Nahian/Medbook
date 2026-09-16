import { apiPostForm, apiPostJson, ApiClientError, type ApiEnvelope, type ApiErrorBody } from "./apiClient";

export type AccountType = "PATIENT" | "CLINIC_OWNER";

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termAndCondition: boolean;
  privacyPolicy: boolean;
  accountType: AccountType;
};

export type SignupResponse = {
  id: number;
  email: string;
  message: string;
  role: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  user: {
    id: number;
    email: string;
    avatar: string | null;
    is_verified: boolean;
  };
  access_token: string;
  refresh_token: string;
};

export type SigninPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  avatar: string | null;
  role: string;
};

export type SigninResponse = {
  user: AuthUser;
  refresh: string;
  access: string;
};

export class ApiError extends ApiClientError {
  constructor(message: string, status?: number, details?: ApiErrorBody) {
    super(message, status, details);
    this.name = "ApiError";
  }
}

const postFormFields = async <T>(
  path: string,
  values: Record<string, string | boolean>
): Promise<ApiEnvelope<T>> => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  try {
    return await apiPostForm<ApiEnvelope<T>>(path, formData);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const signup = (payload: SignupPayload) =>
  postFormFields<SignupResponse>("/signup/", {
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password,
    confirm_password: payload.confirmPassword,
    term_and_condition_accepted: payload.termAndCondition,
    privacy_policy_accepted: payload.privacyPolicy,
    purpose: "signup",
    account_type: payload.accountType,
  });

export const verifySignupOtp = (payload: VerifyOtpPayload) =>
  postFormFields<VerifyOtpResponse>("/verify-otp/", {
    email: payload.email,
    otp: payload.otp,
    purpose: "signup",
  });

export const signin = (payload: SigninPayload) =>
  postFormFields<SigninResponse>("/signin/", {
    email: payload.email,
    password: payload.password,
  });

export const signout = async (accessToken: string, refreshToken: string) => {
  try {
    return await apiPostJson<ApiEnvelope<unknown>>(
      "/signout/",
      { refresh: refreshToken },
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};
