import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PatientSummary } from '../../../shared/models/patient-summary';
import { AgePipe } from '../../../shared/pipes/age.pipe';

@Component({
  selector: 'mk-patient-header',
  imports: [MatCardModule, MatIconModule, AgePipe, TitleCasePipe],
  template: `
    @let p = patient();
    <mat-card appearance="outlined" class="card">
      <div class="avatar" aria-hidden="true">{{ initials() }}</div>
      <div class="identity">
        <h2 class="name">{{ p.fullName }}</h2>
        @if (p.arabicName) {
          <div class="arabic" lang="ar" dir="rtl">{{ p.arabicName }}</div>
        }
        <div class="facts">
          <span class="fact"><mat-icon>badge</mat-icon>{{ p.identifierLabel }}: <strong>{{ p.identifierValue }}</strong></span>
          @if (p.mrn) {
            <span class="fact"><mat-icon>folder_shared</mat-icon>MRN: <strong>{{ p.mrn }}</strong></span>
          }
          @if (p.gender) {
            <span class="fact"><mat-icon>person</mat-icon>{{ p.gender | titlecase }}</span>
          }
          @if (p.birthDate) {
            <span class="fact"><mat-icon>cake</mat-icon>{{ p.birthDate | age }} years ({{ p.birthDate }})</span>
          }
        </div>
      </div>
    </mat-card>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: center;
      padding: 20px;
    }
    .avatar {
      flex: none;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font: var(--mat-sys-title-large);
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .identity {
      min-width: 0;
    }
    .name {
      margin: 0;
      font: var(--mat-sys-headline-small);
    }
    .arabic {
      font: var(--mat-sys-title-medium);
      color: var(--mat-sys-on-surface-variant);
      text-align: left;
    }
    .facts {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      margin-top: 10px;
      color: var(--mat-sys-on-surface-variant);
    }
    .fact {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .fact mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    @media (max-width: 600px) {
      .card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class PatientHeader {
  readonly patient = input.required<PatientSummary>();

  readonly initials = computed(() =>
    this.patient()
      .fullName.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .filter((_, i, all) => i === 0 || i === all.length - 1)
      .join('')
      .toUpperCase(),
  );
}
