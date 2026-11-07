import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { apiErrorMessage } from '../../core/http/api-error';
import { ReadingRow, toReadingRows } from '../../shared/models/reading-row';
import { VitalsService } from './data/vitals.service';

export interface VitalTypeOption {
  code: string;
  label: string;
}

interface ReadingsState {
  nationalId?: string;
  vitalTypeCode?: string;
  recordsPerType: number;
  rows: ReadingRow[];
  types: VitalTypeOption[];
  loading: boolean;
  error?: string;
}

@Injectable()
export class ReadingsStore {
  private readonly vitals = inject(VitalsService);
  private request?: Subscription;

  private readonly state = signal<ReadingsState>({ recordsPerType: 5, rows: [], types: [], loading: false });

  readonly rows = computed(() => this.state().rows);
  readonly total = computed(() => this.state().rows.length);
  readonly types = computed(() => this.state().types);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly vitalTypeCode = computed(() => this.state().vitalTypeCode);
  readonly recordsPerType = computed(() => this.state().recordsPerType);
  readonly isEmpty = computed(() => !this.state().loading && !this.state().error && this.state().rows.length === 0);

  load(nationalId: string): void {
    this.patch({ nationalId, vitalTypeCode: undefined, types: [] });
    this.fetch();
  }

  filterByType(vitalTypeCode: string | undefined): void {
    this.patch({ vitalTypeCode });
    this.fetch();
  }

  changeRecordsPerType(recordsPerType: number): void {
    this.patch({ recordsPerType });
    this.fetch();
  }

  refresh(): void {
    this.fetch();
  }

  private fetch(): void {
    const { nationalId, vitalTypeCode, recordsPerType } = this.state();
    if (!nationalId) {
      return;
    }

    this.request?.unsubscribe();
    this.patch({ loading: true, error: undefined });

    this.request = this.vitals.getLatest({ nationalId, vitalTypeCode: vitalTypeCode ?? null, recordsPerType }).subscribe({
      next: (result) => {
        const rows = result.vitalTypes
          .flatMap(toReadingRows)
          .sort((a, b) => Date.parse(b.effective) - Date.parse(a.effective));

        // The type filter lists the types this patient has readings for, taken from the unfiltered result.
        const types = vitalTypeCode
          ? this.state().types
          : result.vitalTypes.map((t) => ({ code: t.vitalTypeCode, label: t.vitalTypeName }));

        this.patch({ rows, types, loading: false });
      },
      error: (error: unknown) => this.patch({ rows: [], loading: false, error: apiErrorMessage(error) }),
    });
  }

  private patch(partial: Partial<ReadingsState>): void {
    this.state.update((current) => ({ ...current, ...partial }));
  }
}
