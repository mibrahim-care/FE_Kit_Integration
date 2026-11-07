import { HttpErrorResponse } from '@angular/common/http';
import { OperationOutcome } from '../../shared/models/fhir';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Something went wrong. Please try again.';
  }

  if (error.status === 0) {
    return 'The integration service is not reachable. Check that the API is running.';
  }

  if (error.status === 401) {
    return 'The portal is not authorized to call the integration service (API key).';
  }

  // FHIR errors are an OperationOutcome; issue.diagnostics is the readable reason.
  const outcome = parseOutcome(error.error);
  const messages = outcome?.issue
    ?.map((i) => i.diagnostics ?? i.details?.text)
    .filter((m): m is string => !!m);

  if (messages?.length) {
    return messages.join(' ');
  }

  return error.status === 502
    ? 'Fakeeh HIS is not responding. Please try again.'
    : `The request failed (${error.status}).`;
}

function parseOutcome(body: unknown): OperationOutcome | undefined {
  // application/fhir+json is not recognised as JSON by HttpClient error handling, so it may arrive as text.
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return undefined;
    }
  }

  return (body as OperationOutcome | null)?.resourceType === 'OperationOutcome' ? (body as OperationOutcome) : undefined;
}
