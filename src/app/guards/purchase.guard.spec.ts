import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  Navigation,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { purchaseGuard } from './purchase.guard';

describe('purchaseGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigation = {
    extractedUrl: new UrlTree(),
    id: 0,
    initialUrl: new UrlTree(),
    previousNavigation: null,
    trigger: 'imperative',
    extras: {},
  } as Navigation;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => purchaseGuard(...guardParameters));

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', [
      'getCurrentNavigation',
      'navigate',
    ]);
    mockNavigation.extras = {};

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should grant access to route if router navigation object has extra info passed', async () => {
    mockNavigation.extras = { info: 'something' };
    mockRouter.getCurrentNavigation.and.returnValue(mockNavigation);

    const response = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(response).toBeTrue();
  });

  it('should deny access to route if router navigation object has no extra info passed', async () => {
    mockRouter.getCurrentNavigation.and.returnValue(mockNavigation);

    const response = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/']);
    expect(response).not.toBeTrue();
  });

  it('should deny access to route if router navigation object in null', async () => {
    mockRouter.getCurrentNavigation.and.returnValue(null);

    const response = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/']);
    expect(response).not.toBeTrue();
  });
});
