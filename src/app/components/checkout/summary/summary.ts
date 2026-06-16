import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '@core/service/cart/cart.service';

@Component({
  selector: 'component-checkout-summary',
  imports: [CommonModule],
  templateUrl: './summary.html',
})
export class ComponentCheckoutSummary implements OnInit {
  private cartService = inject(CartService);

  subtotal: number = 0;
  deliveryCost: number = 3;
  total: number = 0;

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.calculateSummary(items);
    });
  }

  calculateSummary(items: CartItem[]) {
    this.subtotal = items.reduce((acc, item) => {
      const price = item.product?.finalPrice || item.product?.basePrice || 0;
      return acc + price * item.quantity;
    }, 0);

    // Optional: read delivery method or keep a fixed cost
    // For now we match cart summary (delivery = 3, or dynamic based on method in a shared service)
    this.total = this.subtotal + this.deliveryCost;
  }
}
