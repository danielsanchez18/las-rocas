import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import {
  LucideCheck,
  LucideCircleArrowRight,
  LucideClock,
  LucideShoppingBag,
  LucideStore,
} from '@lucide/angular';

@Component({
  selector: 'component-order-table',
  imports: [
    CommonModule,
    LucideClock,
    LucideCheck,
    LucideShoppingBag,
    LucideCircleArrowRight,
    RouterLink,
    LucideStore,
  ],
  templateUrl: './table.html',
})
export class ComponentOrderTable {
  @Input() order!: OrderResponse;

  get statusLabel(): string {
    switch (this.order?.status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PREPARING':
        return 'Preparando pedido';
      case 'READY':
        return this.order?.orderType === 'DELIVERY'
          ? 'Listo para entrega'
          : 'Listo para recoger';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return this.order?.status || '';
    }
  }

  get statusColorClass(): string {
    const status = this.order?.status;
    if (status === 'PENDING') return 'bg-blue-500';
    if (status === 'PREPARING') return 'bg-yellow-500';
    if (status === 'READY') return 'bg-orange-500';
    if (status === 'COMPLETED') return 'bg-green-600';
    if (status === 'CANCELLED') return 'bg-red-600';
    return 'bg-gray-500';
  }

  get statusTextColorClass(): string {
    const status = this.order?.status;
    if (status === 'PENDING') return 'text-blue-500';
    if (status === 'PREPARING') return 'text-yellow-500';
    if (status === 'READY') return 'text-orange-500';
    if (status === 'COMPLETED') return 'text-green-600';
    if (status === 'CANCELLED') return 'text-red-600';
    return 'text-gray-500';
  }

  get nextStatusLabel(): string | null {
    const status = this.order?.status;
    if (status === 'PENDING') return 'Preparando pedido';
    if (status === 'PREPARING') {
      return this.order?.orderType === 'DELIVERY'
        ? 'Listo para entrega'
        : 'Listo para recoger';
    }
    if (status === 'READY') return 'Completado';
    return null;
  }

  get isCancelled(): boolean {
    return this.order?.status === 'CANCELLED';
  }

  hasReached(step: string): boolean {
    const statusSequence = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];

    // Si esta cancelado, no ha alcanzado nada después de PENDING a menos que se quiera manejar distinto.
    if (this.order?.status === 'CANCELLED') return false;

    const currentIndex = statusSequence.indexOf(this.order?.status);
    let stepIndex = statusSequence.indexOf(step);

    if (currentIndex === -1 || stepIndex === -1) return false;
    return currentIndex >= stepIndex;
  }

  isCurrentStep(step: string): boolean {
    if (this.order?.status === 'CANCELLED') return false;
    return this.order?.status === step;
  }
}
