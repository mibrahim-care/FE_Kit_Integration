import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const SAUDI_ID_PATTERN = /^[12]\d{9}$/;

@Component({
  selector: 'mk-national-id-search',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <form class="search" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="field" subscriptSizing="dynamic">
        <mat-label>National ID / Iqama</mat-label>
        <mat-icon matPrefix>badge</mat-icon>
        <input
          matInput
          [formControl]="control"
          inputmode="numeric"
          autocomplete="off"
          maxlength="10"
          placeholder="e.g. 1123456781"
          aria-describedby="id-hint"
        />
        <mat-hint id="id-hint">10 digits · national ID starts with 1, Iqama with 2</mat-hint>
        @if (control.hasError('required') && control.touched) {
          <mat-error>Enter the patient's national ID or Iqama number.</mat-error>
        } @else if (control.hasError('pattern')) {
          <mat-error>Must be 10 digits, starting with 1 (national ID) or 2 (Iqama).</mat-error>
        }
      </mat-form-field>

      <button mat-flat-button type="submit" class="submit" [disabled]="loading()">
        @if (loading()) {
          <mat-progress-spinner diameter="20" mode="indeterminate" />
        } @else {
          <mat-icon>search</mat-icon>
        }
        Find patient
      </button>
    </form>
  `,
  styles: `
    .search {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .field {
      flex: 1 1 320px;
    }
    .submit {
      height: 56px;
      min-width: 160px;
    }
    .submit mat-progress-spinner {
      display: inline-block;
      margin-right: 8px;
      vertical-align: middle;
    }
  `,
})
export class NationalIdSearch {
  readonly loading = input(false);
  readonly initialValue = input<string>();
  readonly searched = output<string>();

  readonly control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(SAUDI_ID_PATTERN)],
  });

  readonly form = new FormGroup({ nationalId: this.control });

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (value && !this.control.value) {
        this.control.setValue(value);
      }
    });
  }

  submit(): void {
    const value = this.control.value.trim();
    this.control.setValue(value);
    this.control.markAsTouched();

    if (this.control.valid) {
      this.searched.emit(value);
    }
  }
}
