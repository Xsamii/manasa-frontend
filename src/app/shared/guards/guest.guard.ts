import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, combineLatest, filter, map, take } from 'rxjs';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return combineLatest([this.auth.currentUser$, this.auth.sessionReady$]).pipe(
      filter(([, ready]) => ready),
      take(1),
      map(([user]) =>
        user
          ? this.router.createUrlTree([
              user.role === UserRole.TEACHER ? '/teacher' : '/dashboard',
            ])
          : true,
      ),
    );
  }
}
