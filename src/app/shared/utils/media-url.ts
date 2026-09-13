import { environment } from '../../../environments/environment';

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${environment.apiHost}${path.startsWith('/') ? path : `/${path}`}`;
}
