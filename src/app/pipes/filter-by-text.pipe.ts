import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';

@Pipe({
  name: 'filterByText',
  standalone: true
})
export class FilterByTextPipe implements PipeTransform {
  transform(movies: Movie[], search: string): Movie[] {
    if (!search) return movies;
    const lower = search.toLowerCase();

    // Busqueda por Título, Descripción, Director y Género
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(lower) ||
      movie.director.toLowerCase().includes(lower) ||
      movie.genre.toLowerCase().includes(lower) ||
      movie.description.toLowerCase().includes(lower)
    );
  }
}
