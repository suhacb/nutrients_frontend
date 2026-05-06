import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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

  onPageEvent(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
