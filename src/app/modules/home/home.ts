import { Component } from '@angular/core';
import { AuthStore } from '../../core/Auth/store/auth.store';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {
  constructor(public store: AuthStore) {
    console.log('home');
    console.log(this.store.accessToken());
  }
}
