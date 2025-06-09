import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import { Rental } from '../interfaces/rental.interface';

@Pipe({
  name: 'rentalFilterByText',
  standalone: true,
})
export class RentalFilterByTextPipe implements PipeTransform {
  transform(rental: Rental[], search: string): Rental[] {
    if (!search) return rental;
    const lower = search.toLowerCase();

    // Busqueda por Título, Descripción, Director y Género
    return rental.filter(
      (movie) =>
        movie.filmName.toLowerCase().includes(lower) ||
        movie.price.toString().includes(lower) ||
        movie.bookDate?.toString().includes(lower) ||
        (movie.rentalDate ? movie.rentalDate.toISOString().slice(0 ,10).includes(lower) : false) ||
        (movie.expectedReturnDate ? movie.expectedReturnDate.toISOString().slice(0, 10).includes(lower) : false) ||
        (movie.returnDate ? movie.returnDate.toString().includes(lower) : false)
    );
  }
}
