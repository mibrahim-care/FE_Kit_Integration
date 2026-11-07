/** The subset of FHIR R4 the portal reads from the integration API (/fhir). */

export const FHIR_CONTENT_TYPE = 'application/fhir+json';

export const FhirSystems = {
  nationalId: 'http://nphies.sa/identifier/nationalid',
  iqama: 'http://nphies.sa/identifier/iqama',
  mrn: 'http://fakeeh.example/his/mrn',
  vitalType: 'http://fakeeh.example/medical-kit/vital-type',
  vitalField: 'http://fakeeh.example/medical-kit/vital-field',
  readingAddress: 'http://fakeeh.example/fhir/StructureDefinition/reading-address',
  nationality: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
} as const;

export const VITAL_TYPE_CODE_SYSTEM_ID = 'medical-kit-vital-type';

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Identifier {
  system?: string;
  value?: string;
}

export interface Quantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Extension {
  url: string;
  valueString?: string;
  valueCodeableConcept?: CodeableConcept;
  extension?: Extension[];
}

export interface HumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
}

export interface Patient {
  resourceType: 'Patient';
  id?: string;
  identifier?: Identifier[];
  name?: HumanName[];
  gender?: string;
  birthDate?: string;
  telecom?: { system?: string; value?: string; use?: string }[];
  address?: { city?: string; country?: string }[];
  extension?: Extension[];
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
}

export interface Observation {
  resourceType: 'Observation';
  id?: string;
  identifier?: Identifier[];
  code: CodeableConcept;
  effectiveDateTime?: string;
  valueQuantity?: Quantity;
  component?: ObservationComponent[];
  interpretation?: CodeableConcept[];
  note?: { text?: string }[];
  extension?: Extension[];
}

export interface BundleEntry<T> {
  fullUrl?: string;
  resource?: T;
}

export interface Bundle<T> {
  resourceType: 'Bundle';
  type: string;
  total?: number;
  link?: { relation: string; url: string }[];
  entry?: BundleEntry<T>[];
}

export interface CodeSystemConcept {
  code: string;
  display?: string;
  property?: { code: string; valueCode?: string; valueString?: string; valueBoolean?: boolean }[];
  concept?: CodeSystemConcept[];
}

export interface CodeSystem {
  resourceType: 'CodeSystem';
  concept?: CodeSystemConcept[];
}

export interface OperationOutcome {
  resourceType: 'OperationOutcome';
  issue?: { severity?: string; code?: string; diagnostics?: string; details?: { text?: string } }[];
}

export function resources<T>(bundle: Bundle<T>): T[] {
  return (bundle.entry ?? []).map((e) => e.resource).filter((r): r is T => !!r);
}

export function codeFor(concept: CodeableConcept | undefined, system: string): Coding | undefined {
  return concept?.coding?.find((c) => c.system === system);
}
