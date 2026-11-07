export interface ApiError {
  code: string;
  message: string;
  field?: string | null;
}

export interface ApiErrorResponse {
  errors: ApiError[];
}

export interface PatientInfo {
  nationalId: string;
  identifierType: 'nationalId' | 'iqama';
  mrn?: string | null;
  firstName: string;
  middleName?: string | null;
  familyName?: string | null;
  fullNameArabic?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
  nationality?: string | null;
  city?: string | null;
}

export interface GetLatestVitalsRequest {
  nationalId: string;
  recordsPerType?: number;
  vitalTypeCode?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface VitalField {
  key: string;
  label: string;
  unit: string;
}

export interface VitalReading {
  id: string;
  readingId: string;
  dateTime: string;
  values: Record<string, number>;
  isAbnormal?: boolean | null;
  notes?: string | null;
  address?: string | null;
  deviceId?: string | null;
  nurseId?: string | null;
  receivedAt: string;
}

export interface VitalTypeReadings {
  vitalTypeCode: string;
  vitalTypeName: string;
  unit?: string | null;
  fields: VitalField[];
  readings: VitalReading[];
}

export interface LatestVitals {
  nationalId: string;
  recordsPerType: number;
  vitalTypes: VitalTypeReadings[];
}
