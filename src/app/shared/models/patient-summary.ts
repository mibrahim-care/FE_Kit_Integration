import { PatientInfo } from './api';

export interface PatientSummary {
  fullName: string;
  arabicName?: string;
  identifierLabel: 'National ID' | 'Iqama';
  identifierValue: string;
  mrn?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  city?: string;
}

export function toPatientSummary(patient: PatientInfo): PatientSummary {
  return {
    fullName: [patient.firstName, patient.middleName, patient.familyName].filter(Boolean).join(' '),
    arabicName: patient.fullNameArabic ?? undefined,
    identifierLabel: patient.identifierType === 'iqama' ? 'Iqama' : 'National ID',
    identifierValue: patient.nationalId,
    mrn: patient.mrn ?? undefined,
    gender: patient.gender && patient.gender !== 'unknown' ? patient.gender : undefined,
    birthDate: patient.birthDate ?? undefined,
    phone: patient.phone ?? undefined,
    email: patient.email ?? undefined,
    nationality: patient.nationality ?? undefined,
    city: patient.city ?? undefined,
  };
}
