import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { mockInvalidUser, mockValidUser } from '../../../../test/mocks';

describe('LoginComponent', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', [
      'RedirectAfterLogin',
      'login',
    ]);

    authSpy.login
      .withArgs(mockValidUser.username, mockValidUser.password)
      .and.resolveTo(true);
    authSpy.login
      .withArgs(mockInvalidUser.username, mockInvalidUser.password)
      .and.resolveTo(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect back to home page on cancel', () => {
    const cancelButton = fixture.debugElement.nativeElement.querySelector(
      'button[type=button]'
    ) as HTMLButtonElement;
    cancelButton.click();
    fixture.detectChanges();

    expect(authSpy.RedirectAfterLogin).toHaveBeenCalledOnceWith('/');
  });

  it('should redirect after successful login', async () => {
    component.loginForm.setValue({
      username: mockValidUser.username,
      password: mockValidUser.password,
    });
    await component.login();

    expect(authSpy.RedirectAfterLogin).toHaveBeenCalled();
  });

  it('should set error prop after unsuccessful login', async () => {
    component.loginForm.setValue({
      username: mockInvalidUser.username,
      password: mockInvalidUser.password,
    });
    await component.login();

    expect(authSpy.RedirectAfterLogin).not.toHaveBeenCalled();
    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });
});
