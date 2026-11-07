import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Bundle, FhirSystems, Patient, resources } from '../../../shared/models/fhir';
import { PatientSummary, toPatientSummary } from '../../../shared/models/patient-summary';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);

  /**
   * POST /fhir/Patient/_search with identifier=system|value in a form body (never in the URL).
   * National IDs start with 1, Iqama numbers with 2. No match is an empty Bundle, mapped to null.
   */
  findByNationalId(nationalId: string): Observable<PatientSummary | null> {
    const system = nationalId.startsWith('2') ? FhirSystems.iqama : FhirSystems.nationalId;
    const body = new HttpParams().set('identifier', `${system}|${nationalId}`);

    return this.http.post<Bundle<Patient>>(`${environment.fhirBaseUrl}/Patient/_search`, body).pipe(
      map((bundle) => {
        const patient = resources(bundle).find((r) => r.resourceType === 'Patient');
        return patient ? toPatientSummary(patient) : null;
      }),
    );
  }
}
