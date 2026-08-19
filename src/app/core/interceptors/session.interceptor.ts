import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const SESSION_ID_STORAGE_KEY = 'sessionId';

function isApiRequest(url: string): boolean {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  if (url.startsWith(base) || url.startsWith('/api')) {
    return true;
  }

  try {
    const parsed = new URL(url, environment.frontendUrl || window.location.origin);
    return parsed.pathname === '/api' || parsed.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);

  if (!sessionId || !isApiRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        'x-session-id': sessionId,
      },
    }),
  );
};
