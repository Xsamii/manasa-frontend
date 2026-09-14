import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles = (route.data['roles'] as UserRole[] | undefined) ?? [];
    if (!roles.length || this.auth.isRoleAllowed(roles)) {
      return true;
    }
    const role = this.auth.currentUser?.role;
    return this.router.createUrlTree([
      role === UserRole.ADMIN ? '/admin' : role === UserRole.TEACHER ? '/teacher' : '/dashboard',
    ]);
  }
}
