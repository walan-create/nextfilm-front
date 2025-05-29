import { Pipe, PipeTransform } from '@angular/core';
import { Rental } from '../interfaces/rental.interface';

@Pipe({
  name: 'filterRentalByText',
  standalone: true
})
export class FilterRentalByTextPipe implements PipeTransform {
  transform(rentals: Rental[], search: string): Rental[] {
    if (!search) return rentals;
    const lower = search.toLowerCase();

    // Busqueda por Título, Descripción, Director y Género
    return rentals.filter(rental =>
      rental.userName.toLowerCase().includes(lower) ||
      rental.filmName.toLowerCase().includes(lower) ||
      rental.price.toString().includes(lower) ||
      rental.rentalDate?.toString().includes(lower) ||
      rental.returnDate?.toString().includes(lower) ||
      rental.expectedReturnDate?.toString().includes(lower)
    );
  }
}
