import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(value: any[], property: string): any[] {
    if (!value || !property) {
      return value;
    }
    const uniqueItems = new Map();
    value.forEach(item => uniqueItems.set(item[property], item));
    return Array.from(uniqueItems.values());
  }
}
