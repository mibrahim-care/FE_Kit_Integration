import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { apiErrorMessage } from '../../core/http/api-error';
import { ReadingRow } from '../../shared/models/reading-row';
import { VitalTypeOption, VitalsService } from './data/vitals.service';

interface ReadingsState {
  nationalId?: string;
  vitalTypeCode?: string;
  count: number;
  rows: ReadingRow[];
  total: number;
  types: VitalTypeOption[];
  loading: boolean;
  error?: string;
}

@Injectable()
export class ReadingsStore {
  private readonly vitals = inject(VitalsService);
  private request?: Subscription;
  private typesRequest?: Subscription;

  private readonly state = signal<ReadingsState>({ count: 20, rows: [], total: 0, types: [], loading: false });

  readonly rows = computed(() => this.state().rows);
  readonly shown = computed(() => this.state().rows.length);
  readonly total = computed(() => this.state().total);
  readonly types = computed(() => this.state().types);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly vitalTypeCode = computed(() => this.state().vitalTypeCode);
  readonly count = computed(() => this.state().count);
  readonly isEmpty = computed(() => !this.state().loading && !this.state().error && this.state().rows.length === 0);

  load(nationalId: string): void {
    this.patch({ nationalId, vitalTypeCode: undefined });
    this.loadTypes();
    this.fetch();
  }

  filterByType(vitalTypeCode: string | undefined): void {
    this.patch({ vitalTypeCode });
    this.fetch();
  }

  changeCount(count: number): void {
    this.patch({ count });
    this.fetch();
  }

  refresh(): void {
    this.fetch();
  }

  private loadTypes(): void {
    if (this.state().types.length) {
      return;
    }

    // The type filter is a convenience: if the list cannot be loaded the readings still show.
    this.typesRequest?.unsubscribe();
    this.typesRequest = this.vitals.vitalTypes$.subscribe({
      next: (types) => this.patch({ types }),
      error: () => this.patch({ types: [] }),
    });
  }

  private fetch(): void {
    const { nationalId, vitalTypeCode, count } = this.state();
    if (!nationalId) {
      return;
    }

    this.request?.unsubscribe();
    this.patch({ loading: true, error: undefined });

    this.request = this.vitals.search({ nationalId, vitalTypeCode, count }).subscribe({
      next: ({ rows, total }) => this.patch({ rows, total, loading: false }),
      error: (error: unknown) => this.patch({ rows: [], total: 0, loading: false, error: apiErrorMessage(error) }),
    });
  }

  private patch(partial: Partial<ReadingsState>): void {
    this.state.update((current) => ({ ...current, ...partial }));
  }
}
