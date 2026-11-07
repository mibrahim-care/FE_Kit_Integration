import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Shell } from './core/layout/shell';

@Component({
  selector: 'mk-root',
  imports: [Shell],
  template: `<mk-shell />`,
})
export class App {
  constructor() {
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
  }
}
