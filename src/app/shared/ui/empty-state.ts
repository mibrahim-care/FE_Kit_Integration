import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mk-empty-state',
  imports: [MatIconModule],
  template: `
    <mat-icon class="icon" [class.error]="tone() === 'error'">{{ icon() }}</mat-icon>
    <h3>{{ title() }}</h3>
    @if (message()) {
      <p>{{ message() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 16px;
      color: var(--mat-sys-on-surface-variant);
    }
    .icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-outline);
    }
    .icon.error {
      color: var(--mat-sys-error);
    }
    h3 {
      margin: 12px 0 4px;
      font: var(--mat-sys-title-medium);
      color: var(--mat-sys-on-surface);
    }
    p {
      margin: 0;
      max-width: 480px;
    }
  `,
})
export class EmptyState {
  readonly icon = input('info');
  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly tone = input<'neutral' | 'error'>('neutral');
}
