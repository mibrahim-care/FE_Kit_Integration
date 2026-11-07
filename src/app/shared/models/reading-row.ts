import { VitalReading, VitalTypeReadings } from './api';

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

export function toReadingRows(group: VitalTypeReadings): ReadingRow[] {
  return group.readings.map((reading) => {
    const { value, unit } = formatValues(group, reading);
    return {
      id: reading.id,
      effective: reading.dateTime,
      typeCode: group.vitalTypeCode,
      typeLabel: group.vitalTypeName,
      value,
      unit,
      abnormal: reading.isAbnormal ?? undefined,
      note: reading.notes ?? undefined,
      address: reading.address ?? undefined,
    };
  });
}

function formatValues(group: VitalTypeReadings, reading: VitalReading): { value: string; unit: string } {
  const entries = Object.entries(reading.values);
  if (entries.length === 0) {
    return { value: '—', unit: '' };
  }

  const fields = entries.map(([key, value]) => {
    const field = group.fields.find((f) => f.key.toLowerCase() === key.toLowerCase());
    return { label: field?.label ?? key, unit: field?.unit ?? '', value };
  });

  const units = new Set(fields.map((f) => f.unit));
  if (units.size === 1) {
    return { value: fields.map((f) => formatNumber(f.value)).join(' / '), unit: [...units][0] };
  }

  return {
    value: fields.map((f) => `${f.label} ${formatNumber(f.value)} ${f.unit}`.trim()).join(' · '),
    unit: '',
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}
