import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'component-shared-sort-by',
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-by.html',
})
export class ComponentSharedSortBy implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sortValue: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sortValue = params['sort'] || '';
    });
  }

  onSortChange() {
    const queryParams: any = { ...this.route.snapshot.queryParams };
    
    if (this.sortValue) queryParams['sort'] = this.sortValue;
    else delete queryParams['sort'];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
