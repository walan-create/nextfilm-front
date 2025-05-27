import { Pipe, PipeTransform } from '@angular/core';
import { MovieGenre } from '../interfaces/movie-genre.enum';

@Pipe({
  name: 'genreTranslate',
  standalone: true
})
export class GenreTranslatePipe implements PipeTransform {
  private genreMap: Record<string, string> = {
    [MovieGenre.Action]: 'Acción',
    [MovieGenre.Horror]: 'Terror',
    [MovieGenre.Comedy]: 'Comedia',
    [MovieGenre.SciFi]: 'Ciencia Ficción',
    [MovieGenre.Drama]: 'Drama',
    [MovieGenre.Animated]: 'Animación',
    [MovieGenre.Musical]: 'Musical'
  };

  transform(value: string): string {
    // Devuelve la traducción o el valor original con la primera letra en mayúscula
    return this.genreMap[value.toLowerCase()] || (value.charAt(0).toUpperCase() + value.slice(1));
  }
}
