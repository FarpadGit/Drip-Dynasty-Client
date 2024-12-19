import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LabelDirective } from '../../../directives/UI/label.directive';
import { InputDirective } from '../../../directives/UI/input.directive';
import { ButtonDirective } from '../../../directives/UI/button.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LabelDirective,
    InputDirective,
    ButtonDirective,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(private authService: AuthService) {}

  onCancel() {
    this.authService.RedirectAfterLogin('/');
  }

  async login() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if (username && password) {
      this.isLoading = true;
      const success = await this.authService.login(username, password);

      if (success) {
        this.authService.RedirectAfterLogin();
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    }
  }
}
