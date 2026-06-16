import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import { CategoryService } from '@core/service/categories/category.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import {
  LucideSlidersHorizontal,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';

interface DisplayCategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'component-menu-categories',
  imports: [
    CommonModule,
    RouterLink,
    LucideSlidersHorizontal,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  templateUrl: './categories.html',
})
export class ComponentMenuCategories implements OnInit, AfterViewInit {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  categories: DisplayCategory[] = [];
  selectedCategoryId: string | null = null;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  showLeftArrow: boolean = false;
  showRightArrow: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedCategoryId = params.get('idCategory');
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getAll({ enabled: true, deleted: false, size: 10 })
      .subscribe({
        next: (response) => {
          const list = response.data?.content || [];
          this.categories = list.slice(0, 7).map((cat: CategoryResponse) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description || cat.name,
            image:
              cat.imageUrl ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
          }));
        },
        error: (err) => {
          console.error('Error al cargar categorías:', err);
          this.categories = [];
        },
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkArrows(), 100); // Check after render
  }

  onScroll() {
    this.checkArrows();
  }

  checkArrows() {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    this.showLeftArrow = el.scrollLeft > 0;
    // use a small threshold (like 1px) to avoid precision issues
    this.showRightArrow = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
  }

  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  }
}
