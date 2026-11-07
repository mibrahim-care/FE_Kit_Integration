import { FhirSystems, Patient } from './fhir';

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

/** Maps the FHIR Patient returned by POST /fhir/Patient/_search. */
export function toPatientSummary(patient: Patient): PatientSummary {
  const identifiers = patient.identifier ?? [];
  const iqama = identifiers.find((i) => i.system === FhirSystems.iqama);
  const nationalId = identifiers.find((i) => i.system === FhirSystems.nationalId);
  const official = patient.name?.find((n) => n.use === 'official') ?? patient.name?.find((n) => n.use !== 'usual');
  const arabic = patient.name?.find((n) => n.use === 'usual');
  const nationality = patient.extension
    ?.find((e) => e.url === FhirSystems.nationality)
    ?.extension?.find((e) => e.url === 'code')?.valueCodeableConcept;

  return {
    fullName: official?.text ?? [...(official?.given ?? []), official?.family].filter(Boolean).join(' '),
    arabicName: arabic?.text,
    identifierLabel: iqama && !nationalId ? 'Iqama' : 'National ID',
    identifierValue: (iqama ?? nationalId)?.value ?? patient.id ?? '',
    mrn: identifiers.find((i) => i.system === FhirSystems.mrn)?.value,
    gender: patient.gender && patient.gender !== 'unknown' ? patient.gender : undefined,
    birthDate: patient.birthDate,
    phone: patient.telecom?.find((t) => t.system === 'phone')?.value,
    email: patient.telecom?.find((t) => t.system === 'email')?.value,
    nationality: nationality?.text ?? nationality?.coding?.[0]?.display,
    city: patient.address?.find((a) => a.city)?.city,
  };
}
