import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '@core/service/products/product.service';
import { CategoryService } from '@core/service/categories/category.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { ComponentProductDetails } from '@components/product/details/details';
import { ComponentProductRelated } from '@components/product/related/related';

@Component({
  selector: 'page-product',
  imports: [
    CommonModule,
    RouterLink,
    ComponentProductDetails,
    ComponentProductRelated,
  ],
  templateUrl: './product.html',
})
export class PageProduct implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  product: ProductResponse | null = null;
  categoryName: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idProduct = params.get('idProduct');
      if (idProduct) {
        this.loadProductDetails(idProduct);
      }
    });
  }

  loadProductDetails(id: string): void {
    this.productService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
          this.loadCategoryName(this.product.categoryId);
        }
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
      },
    });
  }

  loadCategoryName(categoryId: string): void {
    this.categoryService.getById(categoryId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categoryName = response.data.name;
        }
      },
      error: (err) => {
        console.error('Error al cargar categoría:', err);
      },
    });
  }
}
