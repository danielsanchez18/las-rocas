import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideStore,
  LucideShoppingBag,
  LucideClock,
  LucideUsers,
} from '@lucide/angular';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { CartService } from '@core/service/cart/cart.service';
import { AuthService } from '@core/service/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-product-details',
  imports: [
    CommonModule,
    LucideStore,
    LucideShoppingBag,
    LucideClock,
    LucideUsers,
  ],
  templateUrl: './details.html',
})
export class ComponentProductDetails {
  @Input() product: ProductResponse | any = null;

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  quantity: number = 1;

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(redirectAfter: boolean = false): void {
    this.cartService
      .addItem(
        {
          productId: this.product.id,
          quantity: this.quantity,
        },
        this.product,
      )
      .subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1500,
          });

          if (redirectAfter) {
            this.router.navigate(['/carrito'], { fragment: 'checkout' });
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire(
            'Error',
            'No se pudo agregar el producto al carrito.',
            'error',
          );
        },
      });
  }
}
