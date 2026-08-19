import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { combineLatest, filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return combineLatest([
      this.authService.currentUser$,
      this.authService.sessionReady$,
    ]).pipe(
      filter(([, ready]) => ready),
      take(1),
      map(([user]) =>
        user
          ? true
          : this.router.createUrlTree(['/auth/sign-in'], {
              queryParams: { returnUrl: state.url },
            }),
      ),
    );
  }
}