import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar-component',
  standalone: false,
  templateUrl: './search-bar-component.html',
  styleUrl: './search-bar-component.scss'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';

  @Input() icon!: string;
  @Input() label!: string;
  @Output() search = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.inputSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.search.emit(query));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onInput(): void {
    this.inputSubject.next(this.searchQuery);
  }

  onEnter(): void {
    this.search.emit(this.searchQuery);
  }
}
