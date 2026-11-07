import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { EmptyState } from '../../shared/ui/empty-state';
import { ReadingsTab } from '../readings/readings-tab';
import { NationalIdSearch } from './components/national-id-search';
import { PatientHeader } from './components/patient-header';
import { PatientInfoTab } from './components/patient-info-tab';
import { PatientLookupStore } from './patient-lookup.store';

@Component({
  selector: 'mk-patient-lookup-page',
  imports: [
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressBarModule,
    NationalIdSearch,
    PatientHeader,
    PatientInfoTab,
    ReadingsTab,
    EmptyState,
  ],
  providers: [PatientLookupStore],
  templateUrl: './patient-lookup.page.html',
  styleUrl: './patient-lookup.page.scss',
})
export class PatientLookupPage {
  protected readonly store = inject(PatientLookupStore);
}
