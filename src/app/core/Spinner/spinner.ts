import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: false,
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss'
})
export class Spinner {
  constructor(public spinnerService: SpinnerService) {}
}
