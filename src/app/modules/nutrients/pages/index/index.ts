import { Component } from '@angular/core';
import { NutrientsStore } from '../../store/nutrients.store';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Nutrient } from '../../contracts/Nutrient';

@Component({
  selector: 'app-nutrients-index-page',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class NutrientsIndexPage {
  constructor(public store: NutrientsStore, private router: Router) {
  }
  searchQuery: string  = '';

  onPageEvent(event: PageEvent): void
  {
    if (event.pageIndex === event.previousPageIndex) {
    } else {
      this.store.search('');
    }
  }

  onShowClick(id: number): void {
    this.router.navigate(['/nutrients', id]);
  }

  onSearch(searchQuery: string): void {
    if (searchQuery.trim()) {
      this.store.search(searchQuery);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  showNutrient(nutrient: Nutrient, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/nutrients', nutrient.id]);
  }

  onPageChange(page: number): void {
    const paginator = this.store.paginator();
    if (paginator) {
      this.store.search(paginator.query, page);
    }
  }
}
