import { Component } from '@angular/core';
import { NutrientsStore } from '../../store/nutrients.store';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nutrients-index-page',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class NutrientsIndexPage {
  constructor(public store: NutrientsStore, private router: Router) {}

  onPageEvent(event: PageEvent): void
  {
    if (event.pageIndex === event.previousPageIndex) {
      console.log('user wants to change page items');
    } else {
      this.store.index(event.pageIndex + 1).subscribe();
    }
  }

  onShowClick(id: number): void {
    this.router.navigate(['nutrients/' + id]);
  }

}
