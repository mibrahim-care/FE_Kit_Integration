import { FhirSystems, Observation, Quantity, codeFor } from './fhir';

export interface ReadingRow {
  id: string;
  effective: string;
  typeCode: string;
  typeLabel: string;
  value: string;
  unit: string;
  abnormal?: boolean;
  note?: string;
  address?: string;
}

/** Maps one FHIR Observation returned by POST /fhir/Observation/_search to a table row. */
export function toReadingRow(observation: Observation): ReadingRow {
  const type = codeFor(observation.code, FhirSystems.vitalType);
  const { value, unit } = formatValue(observation);
  const interpretation = observation.interpretation?.[0]?.coding?.[0]?.code;

  return {
    id: observation.id ?? '',
    effective: observation.effectiveDateTime ?? '',
    typeCode: type?.code ?? '',
    typeLabel: observation.code.text ?? type?.display ?? type?.code ?? '—',
    value,
    unit,
    abnormal: interpretation ? interpretation !== 'N' : undefined,
    note: observation.note?.map((n) => n.text).filter(Boolean).join(' ') || undefined,
    address: observation.extension?.find((e) => e.url === FhirSystems.readingAddress)?.valueString,
  };
}

function formatValue(observation: Observation): { value: string; unit: string } {
  if (observation.valueQuantity) {
    return { value: formatNumber(observation.valueQuantity), unit: observation.valueQuantity.unit ?? '' };
  }

  // BP, PF: one component per field.
  const fields = (observation.component ?? [])
    .filter((c) => c.valueQuantity)
    .map((c) => ({
      label: c.code.text ?? codeFor(c.code, FhirSystems.vitalField)?.display ?? '',
      unit: c.valueQuantity!.unit ?? '',
      value: formatNumber(c.valueQuantity!),
    }));

  if (fields.length === 0) {
    return { value: '—', unit: '' };
  }

  const units = new Set(fields.map((f) => f.unit));
  if (units.size === 1) {
    return { value: fields.map((f) => f.value).join(' / '), unit: [...units][0] };
  }

  return { value: fields.map((f) => `${f.label} ${f.value} ${f.unit}`.trim()).join(' · '), unit: '' };
}

function formatNumber(quantity: Quantity): string {
  return quantity.value === undefined
    ? '—'
    : new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(quantity.value);
}
