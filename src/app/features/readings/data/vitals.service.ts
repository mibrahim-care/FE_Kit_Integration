import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetLatestVitalsRequest, LatestVitals } from '../../../shared/models/api';

@Injectable({ providedIn: 'root' })
export class VitalsService {
  private readonly http = inject(HttpClient);

  getLatest(request: GetLatestVitalsRequest): Observable<LatestVitals> {
    return this.http.post<LatestVitals>(`${environment.apiBaseUrl}/GetLatestVitals`, request);
  }
}
