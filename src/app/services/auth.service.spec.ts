import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { APIService } from './API/api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { mockInvalidUser, mockValidUser } from '../../test/mocks';
import { AxiosService } from './API/axios.service';

describe('AuthService', () => {
  let service: AuthService;
  let apiSpy: jasmine.SpyObj<APIService>;
  let axiosSpy: jasmine.SpyObj<AxiosService>;
  let cookieSpy: jasmine.SpyObj<CookieService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('APIService', ['login', 'checkCredentials']);
    axiosSpy = jasmine.createSpyObj('AxiosService', [
      'hasBearer',
      'setBearer',
      'revokeBearer',
    ]);
    cookieSpy = jasmine.createSpyObj('CookieService', [
      'get',
      'set',
      'check',
      'delete',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    apiSpy.login
      .withArgs(mockValidUser.username, mockValidUser.password)
      .and.resolveTo('BearerToken');
    apiSpy.login
      .withArgs(mockInvalidUser.username, mockInvalidUser.password)
      .and.resolveTo({ error: true });
    cookieSpy.get.withArgs('drip-auth').and.returnValue('dripCookie');

    TestBed.configureTestingModule({
      providers: [
        { provide: APIService, useValue: apiSpy },
        { provide: AxiosService, useValue: axiosSpy },
        { provide: CookieService, useValue: cookieSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should forward login request and subsequent cookie modifications when a correct username and password is provided', async () => {
      const response = await service.login(
        mockValidUser.username,
        mockValidUser.password
      );

      expect(apiSpy.login).toHaveBeenCalledOnceWith(
        mockValidUser.username,
        mockValidUser.password
      );
      expect(axiosSpy.setBearer).toHaveBeenCalledOnceWith('BearerToken');
      expect(cookieSpy.set).toHaveBeenCalledOnceWith(
        'drip-auth',
        'BearerToken',
        jasmine.any(Object)
      );
      expect(response).toBeTrue();
    });

    it('should return false if a bad username and password is provided', async () => {
      const response = await service.login(
        mockInvalidUser.username,
        mockInvalidUser.password
      );

      expect(apiSpy.login).toHaveBeenCalledOnceWith(
        mockInvalidUser.username,
        mockInvalidUser.password
      );
      expect(axiosSpy.setBearer).not.toHaveBeenCalled();
      expect(cookieSpy.set).not.toHaveBeenCalled();
      expect(response).toBeFalse();
    });
  });

  describe('authenticate', () => {
    it('should return true if user has proper cookie credentials', async () => {
      axiosSpy.hasBearer.and.returnValue(true);
      cookieSpy.check.withArgs('drip-auth').and.returnValue(true);
      apiSpy.checkCredentials.and.resolveTo(true);

      const response = await service.authenticate();

      expect(response).toBeTrue();
    });

    it('should read bearer token from cookie if not present on browser', async () => {
      axiosSpy.hasBearer.and.returnValue(false);
      cookieSpy.check.withArgs('drip-auth').and.returnValue(true);
      apiSpy.checkCredentials.and.resolveTo(true);

      const response = await service.authenticate();

      expect(axiosSpy.setBearer).toHaveBeenCalledOnceWith('dripCookie');
      expect(response).toBeTrue();
    });

    it('should return false if user has no cookie credentials', async () => {
      axiosSpy.hasBearer.and.returnValue(false);
      cookieSpy.check.withArgs('drip-auth').and.returnValue(false);
      apiSpy.checkCredentials.and.resolveTo(false);

      const response = await service.authenticate();

      expect(response).toBeFalse();
    });
  });

  it('should revoke Bearer token and delete cookie on logout', () => {
    service.logout();

    expect(axiosSpy.revokeBearer).toHaveBeenCalled();
    expect(cookieSpy.delete).toHaveBeenCalledOnceWith('drip-auth');
  });

  describe('RedirectAfterLogin', () => {
    it('should redirect to specified url when requested', () => {
      service.RedirectAfterLogin('some url');

      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['some url'], {
        replaceUrl: true,
      });
    });

    it('should redirect to previously specified url when requested', () => {
      service.setLoginRedirect('some other url');

      service.RedirectAfterLogin();

      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['some other url'], {
        replaceUrl: true,
      });
    });
  });
});
