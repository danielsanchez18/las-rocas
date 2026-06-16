import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'component-shared-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
})
export class ComponentSharedFilters implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isChefRecommendation: boolean = false;
  isNewProduct: boolean = false;
  isToShare: boolean = false;

  get activeFiltersCount(): number {
    let count = 0;
    if (this.isChefRecommendation) count++;
    if (this.isNewProduct) count++;
    if (this.isToShare) count++;
    return count;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isChefRecommendation = params['isChefRecommendation'] === 'true';
      this.isNewProduct = params['isNewProduct'] === 'true';
      this.isToShare = params['isToShare'] === 'true';
    });
  }

  applyFilters() {
    const queryParams: any = { ...this.route.snapshot.queryParams };
    
    if (this.isChefRecommendation) queryParams['isChefRecommendation'] = 'true';
    else delete queryParams['isChefRecommendation'];

    if (this.isNewProduct) queryParams['isNewProduct'] = 'true';
    else delete queryParams['isNewProduct'];

    if (this.isToShare) queryParams['isToShare'] = 'true';
    else delete queryParams['isToShare'];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.isChefRecommendation = false;
    this.isNewProduct = false;
    this.isToShare = false;
    this.applyFilters();
  }
}
