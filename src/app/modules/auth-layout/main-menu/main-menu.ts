import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-menu',
  standalone: false,
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<void>();

  onItemClick() {
    this.menuItemClicked.emit();
  }

  toggle() {
    this.sidenav.toggle();
  }

  triggerLogout() {
    this.logoutClicked.emit();
  }
}
