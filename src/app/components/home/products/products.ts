import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideClock } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { CartService } from '@core/service/cart/cart.service';
import Swal from 'sweetalert2';

interface DisplayProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  basePrice: number;
  finalPrice?: number;
  inDiscount?: boolean;
  preparationTime?: number;
}

@Component({
  selector: 'component-home-products',
  imports: [CommonModule, RouterLink, LucideClock],
  templateUrl: './products.html',
})
export class ComponentHomeProducts implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  products: DisplayProduct[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService
      .getAll({ enabled: true, deleted: false, size: 10 })
      .subscribe({
        next: (response) => {
          const list = response.data?.content || [];
          this.products = list.map((prod: ProductResponse) => ({
            id: prod.id,
            name: prod.name,
            description:
              prod.description ||
              prod.shortDescription ||
              'Delicioso plato preparado al instante con ingredientes seleccionados.',
            image:
              prod.imageUrl ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
            price: prod.finalPrice || prod.basePrice,
            basePrice: prod.basePrice,
            finalPrice: prod.finalPrice,
            inDiscount: prod.inDiscount,
            preparationTime: prod.preparationTime,
          }));
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
        },
      });
  }

  addToCart(product: DisplayProduct): void {
    const productInfo: any = {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      finalPrice: product.finalPrice,
      inDiscount: product.inDiscount,
      imageUrl: product.image,
      shortDescription: product.description,
    };

    this.cartService
      .addItem({ productId: product.id, quantity: 1 }, productInfo)
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
        },
        error: (err: any) => {
          console.error('Error al agregar al carrito:', err);
          Swal.fire(
            'Error',
            'No se pudo agregar el producto al carrito.',
            'error',
          );
        },
      });
  }
}
