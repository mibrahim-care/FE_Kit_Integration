import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyState } from '../../shared/ui/empty-state';
import { ReadingsStore } from './readings.store';

@Component({
  selector: 'mk-readings-tab',
  imports: [
    DatePipe,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    EmptyState,
  ],
  providers: [ReadingsStore],
  templateUrl: './readings-tab.html',
  styleUrl: './readings-tab.scss',
})
export class ReadingsTab {
  readonly nationalId = input.required<string>();

  protected readonly store = inject(ReadingsStore);
  protected readonly columns = ['effective', 'type', 'value', 'unit', 'flag', 'notes'];
  protected readonly recordsPerTypeOptions = [1, 5, 10, 20, 50];

  constructor() {
    effect(() => {
      const nationalId = this.nationalId();
      untracked(() => this.store.load(nationalId));
    });
  }
}
