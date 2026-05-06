import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  standalone: false,
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu {
  @Input() collapsed = false;
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() aiClicked = new EventEmitter<void>();

  triggerLogout(): void {
    this.logoutClicked.emit();
  }

  triggerAiClick(): void {
    this.aiClicked.emit();
  }
}
