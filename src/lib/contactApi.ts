import { apiPostForm, ApiClientError, type ApiEnvelope } from "./apiClient";

export type ContactSubmitPayload = {
  fullName: string;
  email: string;
  queryType: string;
  message: string;
  isAgree: boolean;
};

export type ContactSubmitResponse = {
  id: number;
  full_name: string;
  email: string;
  query_type: string;
  message: string;
  created_at: string;
};

export class ContactApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "ContactApiError";
  }
}

export const submitContactMessage = async (payload: ContactSubmitPayload) => {
  const formData = new FormData();

  formData.append("full_name", payload.fullName);
  formData.append("email", payload.email);
  formData.append("query_type", payload.queryType);
  formData.append("message", payload.message);
  formData.append("is_agree", String(payload.isAgree));

  try {
    return await apiPostForm<ApiEnvelope<ContactSubmitResponse>>("/contact-submit/", formData);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ContactApiError(error.message, error.status);
    }
    throw error;
  }
};
