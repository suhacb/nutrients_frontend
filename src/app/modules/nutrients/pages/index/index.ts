import { Component } from '@angular/core';
import { NutrientsStore } from '../../store/nutrients.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nutrients-index-page',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class NutrientsIndexPage {
  constructor(public store: NutrientsStore, private router: Router) {}

  onSearch(query: string): void {
    if (query.trim()) {
      this.store.search(query);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  onPageChange(page: number): void {
    const paginator = this.store.paginator();
    if (paginator) {
      this.store.search(paginator.query, page);
    }
  }
}
