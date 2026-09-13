import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HomeGuard } from './home.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

describe('HomeGuard', () => {
  it('lets guests open the public info page', () => {
    TestBed.configureTestingModule({
      providers: [
        HomeGuard,
        {
          provide: AuthService,
          useValue: {
            currentUser$: new BehaviorSubject(null),
            sessionReady$: new BehaviorSubject(true),
          },
        },
        { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree') } },
      ],
    });

    TestBed.inject(HomeGuard)
      .canActivate({} as never, {} as never)
      .subscribe(result => expect(result).toBeTrue());
  });

  it('sends a signed-in student to the courses preview page', () => {
    const router = {
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as never),
    };
    TestBed.configureTestingModule({
      providers: [
        HomeGuard,
        {
          provide: AuthService,
          useValue: {
            currentUser$: new BehaviorSubject({ role: UserRole.STUDENT }),
            sessionReady$: new BehaviorSubject(true),
          },
        },
        { provide: Router, useValue: router },
      ],
    });

    TestBed.inject(HomeGuard)
      .canActivate({} as never, {} as never)
      .subscribe(result => expect(result).toEqual(router.createUrlTree.calls.mostRecent().returnValue));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/courses']);
  });
});
