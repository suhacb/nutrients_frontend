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

  onPageEvent(event: PageEvent): void
  {
    if (event.pageIndex === event.previousPageIndex) {
      console.log('user wants to change page items');
    } else {
      this.store.index(event.pageIndex + 1).subscribe();
    }
  }

  onShowClick(id: number): void {
    this.router.navigate(['ingredients/' + id]);
  }

}
