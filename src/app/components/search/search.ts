import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideSearch, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { PromotionService } from '@core/service/promotions/promotion.service';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

interface SearchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'product' | 'promotion';
  slug: string;
}

@Component({
  selector: 'component-search',
  imports: [CommonModule, FormsModule, LucideSearch, LucideChevronLeft, LucideChevronRight],
  templateUrl: './search.html',
})
export class ComponentSearch implements OnInit {
  private productService = inject(ProductService);
  private promotionService = inject(PromotionService);
  private router = inject(Router);

  searchText = signal('');
  suggestions = signal<SearchItem[]>([]);
  results = signal<SearchItem[]>([]);
  isLoading = signal(false);

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadSuggestions();

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.performSearch(term);
      });
  }

  onSearchChange(term: string) {
    this.searchText.set(term);
    this.searchSubject.next(term);
  }

  useSuggestion(suggestion: string) {
    this.searchText.set(suggestion);
    this.performSearch(suggestion);
  }

  loadSuggestions() {
    this.productService
      .getAll({ sort: 'salesCount,desc', size: 4, enabled: true })
      .subscribe({
        next: (res) => {
          console.log('Sugerencias cargadas del backend:', res);
          if (res.success && res.data) {
            const items: SearchItem[] = res.data.content.map(p => ({
              id: p.id,
              name: p.name,
              description: p.shortDescription || p.description || '',
              price: p.finalPrice || p.basePrice,
              imageUrl: p.imageUrl || '',
              type: 'product',
              slug: p.slug
            }));
            this.suggestions.set(items);
          }
        },
      });
  }

  scrollSuggestions(direction: 'left' | 'right') {
    const container = document.getElementById('suggestions-container');
    if (container) {
      const scrollAmount = 250;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  performSearch(term: string) {
    if (!term.trim()) {
      this.results.set([]);
      return;
    }

    this.isLoading.set(true);

    forkJoin({
      products: this.productService.getAll({
        name: term,
        enabled: true,
        size: 10,
      }),
      promotions: this.promotionService.getAll({
        name: term,
        enabled: true,
        size: 10,
      }),
    }).subscribe({
      next: ({ products, promotions }) => {
        const combined: SearchItem[] = [];

        if (products.success && products.data) {
          combined.push(
            ...products.data.content.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.shortDescription || p.description || '',
              price: p.finalPrice || p.basePrice,
              imageUrl: p.imageUrl || '',
              type: 'product' as const,
              slug: p.slug,
            })),
          );
        }

        if (promotions.success && promotions.data) {
          combined.push(
            ...promotions.data.content.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description || '',
              price: p.finalPrice,
              imageUrl: '', // Promotions might not have images directly, wait for UI
              type: 'promotion' as const,
              slug: p.id, // Promotions don't have slugs in the interface
            })),
          );
        }

        this.results.set(combined);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToItem(item: SearchItem) {
    // Close modal
    // @ts-ignore
    if (typeof window !== 'undefined' && window.HSOverlay) {
      // @ts-ignore
      window.HSOverlay.close(document.querySelector('#hs-search-modal'));
    }

    if (item.type === 'product') {
      this.router.navigate(['/producto', item.id]);
    } else {
      // Navigating to promotions if there's a route for it
      this.router.navigate(['/promociones'], {
        queryParams: { name: item.id },
      });
    }
  }

  scrollResults(direction: 'left' | 'right') {
    const container = document.getElementById('results-container');
    if (container) {
      const scrollAmount = 250;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }
}
