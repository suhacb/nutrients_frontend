import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchResultsPaginator } from '../../contracts/SearchResultsPaginator';

@Component({
  selector: 'app-search-pagination-component',
  standalone: false,
  templateUrl: './search-pagination-component.html',
  styleUrl: './search-pagination-component.scss'
})
export class SearchPaginationComponent {
  @Input() paginator: SearchResultsPaginator | null = null;
  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    if (!this.paginator || page < 1 || page > this.paginator.lastPage) return;
    this.pageChange.emit(page);
  }

  get pagesToDisplay(): (number | '...')[] {
    const paginator = this.paginator;
    if (!paginator) return [];

    const { currentPage, lastPage } = paginator;
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
      range.push(i);
    }

    const pages: (number | '...')[] = [1];

    if (range[0] > 2) pages.push('...');
    pages.push(...range);
    if (range[range.length - 1] < lastPage - 1) pages.push('...');
    if (lastPage > 1) pages.push(lastPage);

    return pages;
  }
}
