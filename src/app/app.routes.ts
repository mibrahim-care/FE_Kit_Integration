import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Patient lookup · Medical KIT',
    loadComponent: () => import('./features/patient-lookup/patient-lookup.page').then((m) => m.PatientLookupPage),
  },
  { path: '**', redirectTo: '' },
];
