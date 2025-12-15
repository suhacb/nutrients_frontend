import { Component } from '@angular/core';
import { IngredientsStore } from '../../store/ingredients.store';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ingredients-index-page',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IngredientsIndexPage {

  constructor(public store: IngredientsStore, private router: Router) {}

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onShowClick(id: number): void {
    this.router.navigate(['/ingredients', id]);
  }

  onSearch(searchQuery: string): void {
    if (searchQuery.trim()) {
      this.store.search(searchQuery);
    }
  }

  onPageChange(page: number): void {
    const paginator = this.store.paginator();
    if (paginator) {
      this.store.search(paginator.query, page);
    }
  }
}
