import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '@core/service/cart/cart.service';

@Component({
  selector: 'component-checkout-products',
  imports: [CommonModule],
  templateUrl: './products.html',
})
export class ComponentCheckoutProducts implements OnInit {
  private cartService = inject(CartService);

  @Input() inputItems?: any[];

  items: CartItem[] = [];

  ngOnInit() {
    if (this.inputItems && this.inputItems.length > 0) {
      // Map order items to look like cart items so the HTML works unchanged
      this.items = this.inputItems.map(item => ({
        productId: item.productId,
        promotionId: item.promotionId,
        quantity: item.quantity,
        product: {
          name: item.productName || item.promotionName || 'Producto',
          imageUrl: item.productImageUrl,
          finalPrice: item.unitPrice,
          basePrice: item.unitPrice
        }
      }));
    } else {
      // Load from cart if no input items are provided
      this.cartService.items$.subscribe(items => {
        this.items = items;
      });
    }
  }
}
