import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../shared/models/api';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Something went wrong. Please try again.';
  }

  if (error.status === 0) {
    return 'The integration service is not reachable. Check that the API is running.';
  }

  const messages = (error.error as Partial<ApiErrorResponse> | null)?.errors
    ?.map((e) => e.message)
    .filter((m): m is string => !!m);

  if (messages?.length) {
    return messages.join(' ');
  }

  return error.status === 401
    ? 'The portal is not authorized to call the integration service (API key).'
    : `The request failed (${error.status}).`;
}
