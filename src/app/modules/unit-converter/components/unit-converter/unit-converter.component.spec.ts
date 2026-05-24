import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { UnitConverterComponent } from './unit-converter.component';
import { UnitConverterService } from '../../services/unit-converter.service';
import { UnitsStore } from '../../../ingredients/store/units.store';
import { Unit } from '../../../ingredients/contracts/Unit';
import { UnitConversionResult } from '../../contracts/UnitConversionResult';

function makeUnit(id: number, name: string, abbr: string): Unit {
  return { id, name, abbreviation: abbr, type: 'mass', toBaseFactor: 1, baseUnitId: null, createdAt: new Date(), updatedAt: new Date() };
}

const gramUnit  = makeUnit(1, 'Gram', 'g');
const ounceUnit = makeUnit(2, 'Ounce', 'oz');

const conversionResult: UnitConversionResult = {
  value: 3.5274,
  fromUnit: gramUnit,
  toUnit: ounceUnit,
  nutrientId: null,
};

describe('UnitConverterComponent', () => {
  let fixture: ComponentFixture<UnitConverterComponent>;
  let component: UnitConverterComponent;
  let serviceSpy: jasmine.SpyObj<UnitConverterService>;
  let unitsStoreSpy: { units: jasmine.Spy; index: jasmine.Spy };

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('UnitConverterService', ['convert']);
    serviceSpy.convert.and.returnValue(of(conversionResult));

    unitsStoreSpy = {
      units: jasmine.createSpy('units').and.returnValue([gramUnit, ounceUnit]),
      index: jasmine.createSpy('index').and.returnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      declarations: [UnitConverterComponent],
      providers: [
        { provide: UnitConverterService, useValue: serviceSpy },
        { provide: UnitsStore, useValue: unitsStoreSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UnitConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('calls unitsStore.index() when no units are loaded', () => {
      unitsStoreSpy.units.and.returnValue([]);
      component.ngOnInit();
      expect(unitsStoreSpy.index).toHaveBeenCalled();
    });

    it('does not call unitsStore.index() when units are already loaded', () => {
      unitsStoreSpy.index.calls.reset();
      unitsStoreSpy.units.and.returnValue([gramUnit]);
      component.ngOnInit();
      expect(unitsStoreSpy.index).not.toHaveBeenCalled();
    });
  });

  describe('canConvert', () => {
    it('returns false when inputValue is null', () => {
      component.inputValue = null;
      component.fromUnitId = 1;
      component.toUnitId = 2;
      expect(component.canConvert()).toBeFalse();
    });

    it('returns false when fromUnitId is null', () => {
      component.inputValue = 100;
      component.fromUnitId = null;
      component.toUnitId = 2;
      expect(component.canConvert()).toBeFalse();
    });

    it('returns false when toUnitId is null', () => {
      component.inputValue = 100;
      component.fromUnitId = 1;
      component.toUnitId = null;
      expect(component.canConvert()).toBeFalse();
    });

    it('returns true when all fields are set', () => {
      component.inputValue = 100;
      component.fromUnitId = 1;
      component.toUnitId = 2;
      expect(component.canConvert()).toBeTrue();
    });
  });

  describe('convert', () => {
    beforeEach(() => {
      component.inputValue = 100;
      component.fromUnitId = 1;
      component.toUnitId = 2;
    });

    it('calls service.convert with the correct arguments', () => {
      component.convert();
      expect(serviceSpy.convert).toHaveBeenCalledOnceWith(100, 1, 2, null);
    });

    it('sets the result signal after conversion', () => {
      component.convert();
      expect(component.result()).toEqual(conversionResult);
    });

    it('does nothing when canConvert returns false', () => {
      component.inputValue = null;
      component.convert();
      expect(serviceSpy.convert).not.toHaveBeenCalled();
    });
  });
});
