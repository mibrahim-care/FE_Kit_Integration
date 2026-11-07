import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  let headers = req.headers.set('Accept', 'application/json');
  if (environment.apiKey) {
    headers = headers.set('X-Api-Key', environment.apiKey);
  }

  return next(req.clone({ headers }));
};
