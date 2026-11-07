import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PatientSummary } from '../../../shared/models/patient-summary';
import { AgePipe } from '../../../shared/pipes/age.pipe';

@Component({
  selector: 'mk-patient-info-tab',
  imports: [AgePipe, TitleCasePipe],
  template: `
    @let p = patient();
    <dl class="grid">
      <div><dt>Full name</dt><dd>{{ p.fullName }}</dd></div>
      <div><dt>Arabic name</dt><dd lang="ar" dir="rtl">{{ p.arabicName || '—' }}</dd></div>
      <div><dt>{{ p.identifierLabel }}</dt><dd>{{ p.identifierValue }}</dd></div>
      <div><dt>Medical record number</dt><dd>{{ p.mrn || '—' }}</dd></div>
      <div><dt>Gender</dt><dd>{{ p.gender ? (p.gender | titlecase) : '—' }}</dd></div>
      <div>
        <dt>Date of birth</dt>
        <dd>{{ p.birthDate ? p.birthDate + ' (' + (p.birthDate | age) + ' years)' : '—' }}</dd>
      </div>
      <div><dt>Nationality</dt><dd>{{ p.nationality || '—' }}</dd></div>
      <div><dt>Phone</dt><dd dir="ltr">{{ p.phone || '—' }}</dd></div>
      <div><dt>Email</dt><dd>{{ p.email || '—' }}</dd></div>
      <div><dt>City</dt><dd>{{ p.city || '—' }}</dd></div>
    </dl>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px 32px;
      margin: 0;
      padding: 24px 4px;
    }
    dt {
      font: var(--mat-sys-label-medium);
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 4px;
    }
    dd {
      margin: 0;
      font: var(--mat-sys-body-large);
      overflow-wrap: anywhere;
    }
  `,
})
export class PatientInfoTab {
  readonly patient = input.required<PatientSummary>();
}
