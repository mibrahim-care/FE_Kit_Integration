import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { apiErrorMessage } from '../../core/http/api-error';
import { PatientSummary } from '../../shared/models/patient-summary';
import { PatientService } from './data/patient.service';

type LookupStatus = 'idle' | 'loading' | 'found' | 'not-found' | 'error';

@Injectable()
export class PatientLookupStore {
  private readonly patients = inject(PatientService);
  private request?: Subscription;

  private readonly state = signal<{
    status: LookupStatus;
    searchedId?: string;
    patient?: PatientSummary;
    error?: string;
  }>({ status: 'idle' });

  readonly status = computed(() => this.state().status);
  readonly searchedId = computed(() => this.state().searchedId);
  readonly patient = computed(() => this.state().patient);
  readonly error = computed(() => this.state().error);
  readonly loading = computed(() => this.state().status === 'loading');

  search(nationalId: string): void {
    this.request?.unsubscribe();
    this.state.set({ status: 'loading', searchedId: nationalId });

    this.request = this.patients.findByNationalId(nationalId).subscribe({
      next: (patient) =>
        this.state.set(
          patient
            ? { status: 'found', searchedId: nationalId, patient }
            : { status: 'not-found', searchedId: nationalId },
        ),
      error: (error: unknown) =>
        this.state.set({ status: 'error', searchedId: nationalId, error: apiErrorMessage(error) }),
    });
  }

  reset(): void {
    this.request?.unsubscribe();
    this.state.set({ status: 'idle' });
  }
}
