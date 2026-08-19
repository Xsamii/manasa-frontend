import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

describe('RoleGuard', () => {
  it('redirects teachers away from student-only routes', () => {
    const router = {
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as never),
    };
    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        {
          provide: AuthService,
          useValue: {
            isRoleAllowed: () => false,
            currentUser: { role: UserRole.TEACHER },
          },
        },
        { provide: Router, useValue: router },
      ],
    });

    expect(
      TestBed.inject(RoleGuard).canActivate({ data: { roles: [UserRole.STUDENT] } } as never),
    ).toEqual(router.createUrlTree.calls.mostRecent().returnValue);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/teacher']);
  });
});
