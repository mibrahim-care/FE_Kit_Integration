import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FHIR_CONTENT_TYPE } from '../../shared/models/fhir';

export const apiHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.fhirBaseUrl)) {
    return next(req);
  }

  let headers = req.headers.set('Accept', FHIR_CONTENT_TYPE);
  if (environment.apiKey) {
    headers = headers.set('X-Api-Key', environment.apiKey);
  }

  return next(req.clone({ headers }));
};
