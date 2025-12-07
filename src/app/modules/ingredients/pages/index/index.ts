import { Component } from '@angular/core';
import { IngredientsStore } from '../../store/ingredients.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class IngredientsIndexPage {

  constructor(public store: IngredientsStore, private router: Router) {}
}
