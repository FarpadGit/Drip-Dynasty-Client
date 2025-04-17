import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', async () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'login',
      'setLoginRedirect',
      'authenticate',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should grant access to all routes if user is logged in', async () => {
    mockAuthService.authenticate.and.returnValue(Promise.resolve(true));

    const response = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(response).toBeTrue();
  });

  it('should deny access to all routes if user is not logged in', async () => {
    mockAuthService.authenticate.and.returnValue(Promise.resolve(false));

    const response = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/login']);
    expect(response).not.toBeTrue();
  });
});
