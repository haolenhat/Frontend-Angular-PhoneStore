import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value !== undefined && value !== null) {
      const formattedNumber = value.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
      return formattedNumber + '₫';
    }
    return '';
  }
}
