import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAtSign } from '@lucide/angular';
import { ComponentForgotPasswordCode } from '@components/forgot-password/code/code';
import { AuthService } from '@core/service/auth/auth.service';

@Component({
  selector: 'page-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, LucideAtSign, ComponentForgotPasswordCode],
  templateUrl: './forgot-password.html',
})
export class PageForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword({ email: this.form.value.email }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          // Open Preline modal programmatically
          // @ts-ignore
          if (typeof window !== 'undefined' && window.HSOverlay) {
            // @ts-ignore
            window.HSOverlay.open(document.querySelector('#hs-scale-animation-modal'));
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al solicitar el código';
      }
    });
  }
}
