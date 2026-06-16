import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideX } from '@lucide/angular';
import { CartService, CartItem } from '@core/service/cart/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-cart-products',
  imports: [CommonModule, LucideX],
  templateUrl: './products.html',
})
export class ComponentCartProducts implements OnInit {
  private cartService = inject(CartService);

  items: CartItem[] = [];

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.items = items;
    });
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;
    
    const itemId = item.productId || item.promotionId;
    if (!itemId) return;

    this.cartService.updateItem(itemId, newQuantity).subscribe({
      next: () => {},
      error: (err) => console.error('Error al actualizar cantidad', err)
    });
  }

  removeItem(item: CartItem) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Eliminarás este producto del carrito.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const itemId = item.productId || item.promotionId;
        if (!itemId) return;

        this.cartService.removeItem(itemId).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Producto eliminado',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (err) => console.error('Error al eliminar producto', err)
        });
      }
    });
  }
}
