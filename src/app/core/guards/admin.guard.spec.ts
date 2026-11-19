import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const run = () =>
    TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    localStorage.clear();
  });

  it('should allow an admin', () => {
    localStorage.setItem('role', 'ADMIN');
    expect(run()).toBe(true);
  });

  it('should redirect a regular user', () => {
    localStorage.setItem('role', 'USER');
    expect(run()).toBeInstanceOf(UrlTree);
  });
});
