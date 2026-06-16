import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import { CategoryService } from '@core/service/categories/category.service';

interface DisplayCategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'component-home-categories',
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
})
export class ComponentHomeCategories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categories: DisplayCategory[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll({ enabled: true, deleted: false }).subscribe({
      next: (response) => {
        const list = response.data?.content || [];
        console.log(list);
        this.categories = list.slice(0, 10).map((cat: CategoryResponse) => ({
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
      },
    });
  }
}
