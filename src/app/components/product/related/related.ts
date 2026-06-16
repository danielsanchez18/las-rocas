import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@core/service/products/product.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';

interface DisplayProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  preparationTime: number;
}

@Component({
  selector: 'component-product-related',
  imports: [CommonModule, RouterLink],
  templateUrl: './related.html',
})
export class ComponentProductRelated implements OnChanges {
  private productService = inject(ProductService);

  @Input() categoryId?: string;

  products: DisplayProduct[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryId']) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    const filters: any = { enabled: true, deleted: false, size: 6 };
    if (this.categoryId) {
      filters.categoryId = this.categoryId;
    }

    this.productService.getAll(filters).subscribe({
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
          preparationTime: prod.preparationTime || 0,
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      },
    });
  }
}
