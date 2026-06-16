import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { AuthService } from '@core/service/auth/auth.service';
import {
  LucideCheck,
  LucideChevronRight,
  LucidePartyPopper,
  LucidePrinter,
} from '@lucide/angular';

@Component({
  selector: 'component-order-confirmed-resumen',
  imports: [CommonModule, LucidePrinter, LucideChevronRight, LucideCheck],
  templateUrl: './resumen.html',
})
export class ComponentOrderConfirmedResumen {
  @Input() order: OrderResponse | null = null;
  
  private authService = inject(AuthService);
  
  get userEmail(): string {
    const user = this.authService.currentUser();
    return user ? user.email : 'tu correo electrónico';
  }
}
