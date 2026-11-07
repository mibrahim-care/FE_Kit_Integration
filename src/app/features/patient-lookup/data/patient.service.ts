import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PatientInfo } from '../../../shared/models/api';
import { PatientSummary, toPatientSummary } from '../../../shared/models/patient-summary';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);

  findByNationalId(nationalId: string): Observable<PatientSummary | null> {
    return this.http.post<PatientInfo>(`${environment.apiBaseUrl}/GetPatientInfo`, { nationalId }).pipe(
      map(toPatientSummary),
      catchError((error: unknown) =>
        error instanceof HttpErrorResponse && error.status === 404 ? of(null) : throwError(() => error),
      ),
    );
  }
}
