import { Component, inject, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ProductService } from '@core/service/products/product.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { LucideClock, LucideBadgeAlert } from '@lucide/angular';
import { CommonModule } from '@angular/common';
import { CartService } from '@core/service/cart/cart.service';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { PromotionService } from '@core/service/promotions/promotion.service';
import { PromotionResponse } from '@core/interfaces/promotions/promotion.interface';
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
  isPromotion?: boolean;
}

@Component({
  selector: 'component-menu-products',
  imports: [
    CommonModule,
    RouterLink,
    LucideClock,
    LucideBadgeAlert,
    ComponentSharedPaginator,
  ],
  templateUrl: './products.html',
})
export class ComponentMenuProducts implements OnInit {
  private productService = inject(ProductService);
  private promotionService = inject(PromotionService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private router = inject(Router);

  products: DisplayProduct[] = [];
  selectedCategoryId: string | null = null;

  page: number = 0;
  size: number = 8;
  totalPages: number = 0;
  totalElements: number = 0;

  currentFilters: any = {};

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParams]).subscribe(
      ([paramMap, queryParams]) => {
        const newCategoryId = paramMap.get('idCategory');

        // Si la categoría cambió, o es la primera vez, recargamos y reiniciamos página
        if (this.selectedCategoryId !== newCategoryId) {
          this.selectedCategoryId = newCategoryId;
          this.page = 0;
        }

        this.currentFilters = {
          isChefRecommendation: queryParams['isChefRecommendation'] === 'true',
          isNewProduct: queryParams['isNewProduct'] === 'true',
          isToShare: queryParams['isToShare'] === 'true',
          sort: queryParams['sort'],
        };

        this.loadProducts();
      },
    );
  }

  loadProducts(): void {
    if (this.selectedCategoryId === 'promociones') {
      const filters: any = {
        enabled: true,
        deleted: false,
        size: this.size,
        page: this.page,
      };
      if (this.currentFilters.sort) {
        let sortParam = this.currentFilters.sort;
        if (sortParam.includes('basePrice')) {
          sortParam = sortParam.replace('basePrice', 'finalPrice'); // Promotions use finalPrice
        }
        filters.sort = sortParam;
      }

      this.promotionService.getAll(filters).subscribe({
        next: (response) => {
          this.totalPages = response.data?.totalPages || 0;
          this.totalElements = response.data?.totalElements || 0;
          const list = response.data?.content || [];
          this.products = list.map((promo: PromotionResponse) => ({
            id: promo.id,
            name: promo.name,
            description:
              promo.description || 'Promoción especial por tiempo limitado.',
            image:
              promo.products &&
              promo.products.length > 0 &&
              promo.products[0].productImageUrl
                ? promo.products[0].productImageUrl
                : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
            price: promo.finalPrice,
            basePrice: promo.originalPrice,
            finalPrice: promo.finalPrice,
            inDiscount: true,
            isPromotion: true,
          }));
        },
        error: (err) => {
          console.error('Error al cargar promociones:', err);
          this.products = [];
        },
      });
      return;
    }

    const filters: any = {
      enabled: true,
      deleted: false,
      size: this.size,
      page: this.page,
    };
    if (this.selectedCategoryId) {
      filters.categoryId = this.selectedCategoryId;
    }
    if (this.currentFilters.isChefRecommendation)
      filters.isChefRecommendation = true;
    if (this.currentFilters.isNewProduct) filters.isNewProduct = true;
    if (this.currentFilters.isToShare) filters.isToShare = true;
    if (this.currentFilters.sort) filters.sort = this.currentFilters.sort;

    this.productService.getAll(filters).subscribe({
      next: (response) => {
        this.totalPages = response.data?.totalPages || 0;
        this.totalElements = response.data?.totalElements || 0;
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
          isPromotion: false,
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.products = [];
      },
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadProducts();
  }

  addToCart(product: DisplayProduct): void {
    const request = product.isPromotion
      ? { promotionId: product.id, quantity: 1 }
      : { productId: product.id, quantity: 1 };

    const productInfo: any = {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      finalPrice: product.finalPrice,
      inDiscount: product.inDiscount,
      imageUrl: product.image,
      shortDescription: product.description,
    };

    this.cartService.addItem(request, productInfo).subscribe({
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

  buyNow(product: DisplayProduct): void {
    const request = product.isPromotion
      ? { promotionId: product.id, quantity: 1 }
      : { productId: product.id, quantity: 1 };

    const productInfo: any = {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      finalPrice: product.finalPrice,
      inDiscount: product.inDiscount,
      imageUrl: product.image,
      shortDescription: product.description,
    };

    this.cartService.addItem(request, productInfo).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: (err: any) => {
        console.error('Error al comprar producto:', err);
        Swal.fire('Error', 'No se pudo procesar la compra.', 'error');
      },
    });
  }
}
