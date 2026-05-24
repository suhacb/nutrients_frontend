import { Component, OnInit, signal } from '@angular/core';
import { UnitsStore } from '../../../ingredients/store/units.store';
import { UnitConversionResult } from '../../contracts/UnitConversionResult';
import { UnitConverterService } from '../../services/unit-converter.service';

@Component({
  selector: 'app-unit-converter',
  standalone: false,
  templateUrl: './unit-converter.component.html',
  styleUrl: './unit-converter.component.scss',
})
export class UnitConverterComponent implements OnInit {
  inputValue: number | null = null;
  fromUnitId: number | null = null;
  toUnitId: number | null = null;
  nutrientId: number | null = null;

  readonly result = signal<UnitConversionResult | null>(null);

  constructor(
    public unitsStore: UnitsStore,
    private converterService: UnitConverterService,
  ) {}

  ngOnInit(): void {
    if (this.unitsStore.units().length === 0) {
      this.unitsStore.index().subscribe();
    }
  }

  canConvert(): boolean {
    return this.inputValue != null && this.fromUnitId != null && this.toUnitId != null;
  }

  convert(): void {
    if (!this.canConvert()) return;
    this.converterService
      .convert(this.inputValue!, this.fromUnitId!, this.toUnitId!, this.nutrientId)
      .subscribe(result => this.result.set(result));
  }
}
