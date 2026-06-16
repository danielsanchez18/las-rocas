import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { LucideClock } from '@lucide/angular';

@Component({
  selector: 'component-order-confirmed-summary',
  imports: [CommonModule, LucideClock],
  templateUrl: './summary.html',
})
export class ComponentOrderConfirmedSummary {
  @Input() order: OrderResponse | null = null;
}
