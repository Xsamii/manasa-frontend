import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GuestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

describe('GuestGuard', () => {
  it('sends an authenticated teacher to the teacher workspace', () => {
    const router = {
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as never),
    };
    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        {
          provide: AuthService,
          useValue: {
            currentUser$: new BehaviorSubject({ role: UserRole.TEACHER }),
            sessionReady$: new BehaviorSubject(true),
          },
        },
        { provide: Router, useValue: router },
      ],
    });

    TestBed.inject(GuestGuard)
      .canActivate({} as never, {} as never)
      .subscribe(result => expect(result).toEqual(router.createUrlTree.calls.mostRecent().returnValue));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/teacher']);
  });
});
