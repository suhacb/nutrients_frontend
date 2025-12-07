import { Component, Input } from '@angular/core';
import { Breadcrumb } from './breadcrumb.d';

@Component({
  selector: 'app-breadcrumb-component',
  standalone: false,
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent {
  @Input() links: Breadcrumb[] = [];
}
