import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Bundle, CodeSystem, Observation, VITAL_TYPE_CODE_SYSTEM_ID, resources } from '../../../shared/models/fhir';
import { ReadingRow, toReadingRow } from '../../../shared/models/reading-row';

export interface VitalTypeOption {
  code: string;
  label: string;
}

export interface ReadingsSearch {
  nationalId: string;
  vitalTypeCode?: string;
  count: number;
}

export interface ReadingsPage {
  total: number;
  rows: ReadingRow[];
}

@Injectable({ providedIn: 'root' })
export class VitalsService {
  private readonly http = inject(HttpClient);

  /** GET /fhir/CodeSystem/medical-kit-vital-type: every vital type the KIT can send. Fetched once. */
  readonly vitalTypes$: Observable<VitalTypeOption[]> = this.http
    .get<CodeSystem>(`${environment.fhirBaseUrl}/CodeSystem/${VITAL_TYPE_CODE_SYSTEM_ID}`)
    .pipe(
      map((codeSystem) => (codeSystem.concept ?? []).map((c) => ({ code: c.code, label: c.display ?? c.code }))),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

  /** POST /fhir/Observation/_search: the patient's newest readings, optionally of one vital type. */
  search({ nationalId, vitalTypeCode, count }: ReadingsSearch): Observable<ReadingsPage> {
    let body = new HttpParams()
      .set('patient', `Patient/${nationalId}`)
      .set('_sort', '-date')
      .set('_count', count);
    if (vitalTypeCode) {
      body = body.set('code', vitalTypeCode);
    }

    return this.http.post<Bundle<Observation>>(`${environment.fhirBaseUrl}/Observation/_search`, body).pipe(
      map((bundle) => {
        const rows = resources(bundle)
          .filter((r) => r.resourceType === 'Observation')
          .map(toReadingRow);
        return { total: bundle.total ?? rows.length, rows };
      }),
    );
  }
}
