import { Component } from '@angular/core';
import { IngredientsStore } from '../../store/ingredients.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredients-index-page',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IngredientsIndexPage {
  constructor(public store: IngredientsStore, private router: Router) {}

  onSearch(query: string): void {
    if (query.trim()) {
      this.store.search(query);
    }
  }

  onPageChange(page: number): void {
    const paginator = this.store.paginator();
    if (paginator) {
      this.store.search(paginator.query, page);
    }
  }
}
