import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test {
  public routes: Routes;

  constructor(private router: Router) {
    this.routes = router.config;
  }
}
