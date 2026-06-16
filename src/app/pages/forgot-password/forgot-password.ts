import { Component } from '@angular/core';
import { LucideAtSign } from '@lucide/angular';
import { ComponentForgotPasswordCode } from '@components/forgot-password/code/code';

@Component({
  selector: 'page-forgot-password',
  imports: [LucideAtSign, ComponentForgotPasswordCode],
  templateUrl: './forgot-password.html',
})
export class PageForgotPassword {}
