import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from './API/api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private UrlToNavigateFromLoginPage: string = '/admin';

  constructor(
    private APIService: APIService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  async login(username: string, password: string) {
    const response = await this.APIService.login(username, password);
    if (response.error) return false;
    this.APIService.setBearer(response as string);
    this.cookieService.set('drip-auth', response as string, {
      expires: 1,
      path: '/',
      secure: true,
    });
    return true;
  }

  async authenticate() {
    if (!this.APIService.hasBearer() && this.cookieService.check('drip-auth')) {
      const bearer = this.cookieService.get('drip-auth');
      this.APIService.setBearer(bearer);
    }
    return await this.APIService.checkCredentials();
  }

  logout() {
    this.APIService.revokeBearer();
    this.cookieService.delete('drip-auth');
  }

  setLoginRedirect(url: string) {
    this.UrlToNavigateFromLoginPage = url;
  }

  RedirectAfterLogin(url?: string) {
    this.router.navigate([url ?? this.UrlToNavigateFromLoginPage], {
      replaceUrl: true,
    });
  }
}