import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar-component',
  standalone: false,
  templateUrl: './search-bar-component.html',
  styleUrl: './search-bar-component.scss'
})
export class SearchBarComponent {
  searchQuery: string = '';

  @Input() icon!: string;
  @Input() label!: string;
  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }
}
