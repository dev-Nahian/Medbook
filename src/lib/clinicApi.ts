import {
  apiGet,
  apiPostForm,
  ApiClientError,
  type ApiEnvelope,
} from "./apiClient";

export class ClinicApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "ClinicApiError";
  }
}

export type ClinicImage = {
  id: number;
  image: string;
  image_url: string;
};

export type ClinicTreatment = {
  id?: number;
  name?: string;
  title?: string;
  treatment_name?: string;
  price?: string;
  amount?: string;
};

export type ClinicRating = {
  clinic: number;
  rating: string;
};

export type ClinicFacility = {
  id?: number;
  name?: string;
  facility_name?: string;
  title?: string;
};

export type ClinicInsurance = {
  id: number;
  insurance_name: string;
  clinic: number;
};

export type ClinicAcceptedPatient = {
  id?: number;
  name?: string;
  patient_type?: string;
  patient_name?: string;
  title?: string;
};

export type ClinicPaymentMethod = {
  id?: number;
  name?: string;
  payment_method?: string;
  payment_method_name?: string;
  title?: string;
};

export type ClinicAvailability = {
  id?: number;
  date?: string;
  day?: string;
};

type ClinicBase = {
  id: number;
  clinic: number;
  name: string;
  title: string;
  country: string;
  city: string;
  images: ClinicImage[];
  treatments: ClinicTreatment[];
  facilities: ClinicFacility[];
  insurances: ClinicInsurance[];
};

export type ClinicListItem = ClinicBase & {
  distance_from_city_center: string;
  ratings: ClinicRating[];
  average_rating: number;
};

export type ClinicDetailsItem = ClinicBase & {
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  per_treatment_price: string;
  accepted_patients: ClinicAcceptedPatient[];
  payment_methods: ClinicPaymentMethod[];
  availabilities: ClinicAvailability[];
};

export type AppointmentPatientDetail = {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  language: string;
};

export type AppointmentSchedule = {
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening";
};

export type AppointmentHealthStatus = {
  hivpositive: boolean;
  hvbpositive?: boolean;
  hbvpositive?: boolean;
  hcvpositive: boolean;
};

export type AppointmentInsurance = {
  ehic_holder: boolean;
  ghic_holder: boolean;
};

export type AppointmentTreatmentType = {
  treatment_type: "HD" | "HDF" | string;
};

export type AppointmentCarePartner = {
  bringing_partner: boolean;
};

export type AppointmentHomeClinic = {
  clinic_name: string;
  home_clinic_consultant_name: string;
};

export type AppointmentPayload = {
  clinic: string | number;
  patient_detail: AppointmentPatientDetail;
  schedules: AppointmentSchedule[];
  health_status: AppointmentHealthStatus;
  insurance: AppointmentInsurance;
  treatment_type: AppointmentTreatmentType;
  care_partner: AppointmentCarePartner;
  home_clinic: AppointmentHomeClinic;
  medical_reports?: File | null;
};

export type AppointmentResponseData = {
  id: number;
  user: number;
  clinic: number;
  appointment_id: string;
  schedules: {
    id: number;
    appointment: number;
    treatment_date: string;
    shift: string;
  }[];
  patient_detail: AppointmentPatientDetail & {
    id: number;
    appointment: number;
  };
  health_status: {
    id: number;
    appointment: number;
    hivpositive: boolean;
    hvbpositive: boolean;
    hcvpositive: boolean;
  };
  insurance: {
    id: number;
    appointment: number;
    ehic_holder: boolean;
    ghic_holder: boolean;
  };
  treatment_type: {
    id: number;
    appointment: number;
    treatment_type: string;
  };
  care_partner: {
    id: number;
    appointment: number;
    bringing_partner: boolean;
  };
  home_clinic: {
    id: number;
    appointment: number;
    clinic_name: string;
    home_clinic_consultant_name: string;
  };
  medical_reports?: {
    id: number;
    appointment: number;
    file_url: string;
  }[];
  status: string;
  created_at: string;
};

export type AppointmentListSchedule = {
  id: number;
  appointment: number;
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening" | string;
};

export type BookedSlot = {
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening" | string;
};

type BookedSlotsResponse = {
  clinic_id: string;
  count: number;
  booked_slots: BookedSlot[];
};

export type AppointmentListItem = {
  id: number;
  user: number;
  clinic: number;
  appointment_id: string;
  schedules: AppointmentListSchedule[];
  patient_detail: AppointmentPatientDetail & {
    id: number;
    appointment: number;
  };
  health_status: {
    id: number;
    appointment: number;
    hivpositive: boolean;
    hbvpositive?: boolean;
    hvbpositive?: boolean;
    hcvpositive: boolean;
  };
  insurance: {
    id: number;
    appointment: number;
    ehic_holder: boolean;
    ghic_holder: boolean;
  };
  treatment_type: {
    id: number;
    appointment: number;
    treatment_type: "HD" | "HDF" | string;
  };
  care_partner: {
    id: number;
    appointment: number;
    bringing_partner: boolean;
  };
  home_clinic: {
    id: number;
    appointment: number;
    clinic_name: string;
    home_clinic_consultant_name: string;
  };
  medical_reports: {
    id: number;
    appointment: number;
    file_url: string;
  }[];
  status: string;
  created_at: string;
};

type AppointmentListResponse = {
  message: string;
  count: number;
  data: AppointmentListItem[];
};

export type ClinicSearchParams = {
  date: string;
  location: string;
};

type ClinicSearchResponse = {
  location: string;
  date: string;
  count: number;
  clinics: ClinicListItem[];
};

export const getClinics = async () => {
  try {
    const res = await apiGet<ApiEnvelope<{ clinics: ClinicListItem[] }>>("/clinics/");
    return res.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const searchClinics = async ({ date, location }: ClinicSearchParams) => {
  try {
    const res = await apiGet<ClinicSearchResponse>("/clinic/search/", {
      params: { date, location },
    });
    return { clinics: res.clinics ?? [] };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicDetails = async (clinicId: string | number) => {
  try {
    const res = await apiGet<ApiEnvelope<{ clinic: ClinicDetailsItem }>>(`/clinics/${clinicId}/`);
    return res.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getAppointments = async (accessToken?: string | null) => {
  try {
    return await apiGet<AppointmentListResponse>("/appointments/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getBookedSlots = async (clinicId: string | number) => {
  try {
    return await apiGet<BookedSlotsResponse>(
      `/appointments/booked-slots/?clinic_id=${encodeURIComponent(String(clinicId))}`
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};



// Book appointment API
export const createAppointment = async (
  payload: AppointmentPayload,
  accessToken?: string | null
) => {
  const formData = new FormData();

  formData.append("clinic", String(payload.clinic));
  formData.append("patient_detail", JSON.stringify(payload.patient_detail));
  formData.append("schedules", JSON.stringify(payload.schedules));
  formData.append(
    "health_status",
    JSON.stringify({
      hivpositive: Boolean(payload.health_status.hivpositive),
      hvbpositive: Boolean(payload.health_status.hvbpositive ?? payload.health_status.hbvpositive),
      hcvpositive: Boolean(payload.health_status.hcvpositive),
    })
  );
  formData.append("insurance", JSON.stringify(payload.insurance));
  formData.append("treatment_type", JSON.stringify(payload.treatment_type));
  formData.append("care_partner", JSON.stringify(payload.care_partner));
  formData.append("home_clinic", JSON.stringify(payload.home_clinic));

  if (payload.medical_reports) {
    formData.append(
      "medical_reports",
      payload.medical_reports,
      payload.medical_reports.name
    );
  }

  try {
    return await apiPostForm<ApiEnvelope<AppointmentResponseData>>("/appointments/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};
