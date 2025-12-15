import { Component, Input } from '@angular/core';
import { SearchResultsPaginator } from '../../contracts/SearchResultsPaginator';

@Component({
  selector: 'app-search-info-component',
  standalone: false,
  templateUrl: './search-info-component.html',
  styleUrl: './search-info-component.scss'
})
export class SearchInfoComponent {
  @Input() paginator: SearchResultsPaginator | null = null;
}
