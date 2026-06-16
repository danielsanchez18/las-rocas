import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '@core/service/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'component-cart-summary',
  imports: [RouterLink, CommonModule],
  templateUrl: './summary.html',
})
export class ComponentCartSummary implements OnInit {
  private cartService = inject(CartService);

  subtotal: number = 0;
  deliveryCost: number = 3;
  total: number = 0;
  itemCount: number = 0;

  ngOnInit() {
    this.cartService.items$.subscribe((items) => {
      this.calculateSummary(items);
    });
  }

  calculateSummary(items: CartItem[]) {
    this.subtotal = items.reduce((acc, item) => {
      const price = item.product?.finalPrice || item.product?.basePrice || 0;
      return acc + price * item.quantity;
    }, 0);

    this.itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Simple delivery cost logic, can be adjusted based on requirements
    // this.deliveryCost = this.subtotal > 0 ? 0 : 0; // Currently free delivery

    this.total = this.subtotal + this.deliveryCost;
  }
}
