import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results-item-component',
  standalone: false,
  templateUrl: './search-results-item-component.html',
  styleUrl: './search-results-item-component.scss'
})
export class SearchResultsItemComponent {
  @Input() url!: string;
  @Input() title!: string;
  @Input() description?: string | null;

  constructor(private router: Router) {}

  onClickShow(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl(this.url);
  }
}
