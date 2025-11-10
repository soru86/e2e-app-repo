import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IdentityService } from '../../services/identity.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() loggedIn = new EventEmitter<void>();

  readonly loginForm: FormGroup;
  readonly registerForm: FormGroup;
  mode: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';

  constructor(private readonly fb: FormBuilder, private readonly identityService: IdentityService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  switchMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMessage = '';
  }

  submit(): void {
    this.errorMessage = '';
    this.loading = true;
    const handler = this.mode === 'login' ? this.login$() : this.register$();
    handler.add(() => (this.loading = false));
  }

  private login$() {
    const { email, password } = this.loginForm.value;
    return this.identityService.login(email, password).subscribe({
      next: () => this.loggedIn.emit(),
      error: err => this.errorMessage = err.error?.message ?? 'Unable to login'
    });
  }

  private register$() {
    const { email, displayName, password } = this.registerForm.value;
    return this.identityService.register(email, displayName, password).subscribe({
      next: () => this.loggedIn.emit(),
      error: err => this.errorMessage = err.error?.message ?? 'Unable to register'
    });
  }
}

