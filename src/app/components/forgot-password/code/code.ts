import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth/auth.service';

@Component({
  selector: 'component-forgot-password-code',
  imports: [CommonModule, FormsModule],
  templateUrl: './code.html',
})
export class ComponentForgotPasswordCode {
  private authService = inject(AuthService);
  private router = inject(Router);

  codeArr: string[] = ['', '', '', '', '', ''];
  isLoading = false;
  errorMessage = '';

  get email() {
    return this.authService.resetEmail;
  }

  onInput(event: any, index: number) {
    const val = event.target.value;
    if (val && index < 5) {
      // Focus next input
      const nextInput = event.target.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && !this.codeArr[index] && index > 0) {
      const prevInput = event.target.previousElementSibling;
      if (prevInput) {
        prevInput.focus();
        this.codeArr[index - 1] = '';
      }
    }
  }

  resendCode() {
    if (!this.email) return;
    this.authService.forgotPassword({ email: this.email }).subscribe();
  }

  verifyCode() {
    const fullCode = this.codeArr.join('');
    if (fullCode.length !== 6 || !this.email) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .verifyCode({ email: this.email, code: fullCode })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            // Close modal and navigate
            // @ts-ignore
            if (typeof window !== 'undefined' && window.HSOverlay) {
              // @ts-ignore
              window.HSOverlay.close(
                document.querySelector('#hs-scale-animation-modal'),
              );
            }
            this.router.navigate(['/auth/nueva-clave']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Código incorrecto';
        },
      });
  }
}
