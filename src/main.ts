import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

/**
 * Deployment settings (fhirBaseUrl, apiKey) can be changed on the server without a rebuild by editing
 * config.json next to index.html. Missing or invalid config.json: the built-in environment values are used.
 */
async function loadRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch('config.json', { cache: 'no-store' });
    if (!response.ok) {
      return;
    }

    const config = (await response.json()) as Partial<typeof environment>;
    if (typeof config.fhirBaseUrl === 'string' && config.fhirBaseUrl.trim()) {
      environment.fhirBaseUrl = config.fhirBaseUrl.trim().replace(/\/+$/, '');
    }
    if (typeof config.apiKey === 'string') {
      environment.apiKey = config.apiKey;
    }
  } catch {
    // No usable config.json (e.g. the dev server): keep the built-in values.
  }
}

loadRuntimeConfig()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
