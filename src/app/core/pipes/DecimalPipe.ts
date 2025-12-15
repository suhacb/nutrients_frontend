import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'decimal',
    pure: true
})
export class DecimalPipe implements PipeTransform {
    transform(value: number | string, fractionDigits: number = 2): string {
         if (value == null || value === '') return '';

         const numberValue = typeof value === 'string' ? parseFloat(value) : value;

        return new Intl.NumberFormat('de-DE', { // German locale uses comma decimal, dot thousand
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
        }).format(numberValue);
    }
}