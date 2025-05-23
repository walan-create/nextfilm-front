import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {
  transform<T>(array: T[], field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    if (!Array.isArray(array) || !field) return array;
    return [...array].sort((a, b) => {
      if (a[field]! < b[field]!) return direction === 'asc' ? -1 : 1;
      if (a[field]! > b[field]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
