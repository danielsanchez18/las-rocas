import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '@core/service/cart/cart.service';
import { LucideX, LucideTrash2, LucideShoppingBag } from '@lucide/angular';

@Component({
  selector: 'component-cart-offcanvas',
  imports: [CommonModule, LucideX, LucideTrash2, LucideShoppingBag],
  templateUrl: './offcanvas.html',
})
export class ComponentCartOffcanvas implements OnInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartItems: CartItem[] = [];
  subtotal: number = 0;
  private cartSubscription?: Subscription;

  ngOnInit(): void {
    this.cartSubscription = this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.calculateSubtotal();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((acc, item) => {
      const price = item.product?.finalPrice ?? item.product?.basePrice ?? 0;
      return acc + price * item.quantity;
    }, 0);
  }

  incrementQuantity(itemId: string, currentQty: number): void {
    this.cartService.updateItem(itemId, currentQty + 1).subscribe();
  }

  decrementQuantity(itemId: string, currentQty: number): void {
    if (currentQty > 1) {
      this.cartService.updateItem(itemId, currentQty - 1).subscribe();
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId).subscribe();
  }

  closeOffcanvas(): void {
    const overlay = document.querySelector('#hs-offcanvas-cart');
    if (overlay) {
      const { HSOverlay } = window as any;
      if (HSOverlay) {
        HSOverlay.close(overlay);
      } else {
        overlay.classList.add('hidden');
        overlay.classList.remove('open');
      }
    }
  }

  goToCheckout(): void {
    this.closeOffcanvas();
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 300);
  }

  goToCart(): void {
    this.closeOffcanvas();
    this.router.navigate(['/carrito']);
  }
}
