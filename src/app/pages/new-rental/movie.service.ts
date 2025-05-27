// archivo: movies.service.ts o mock en lugar del real
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MoviesServices {
  getAllMovies() {
    return of([
      { id: 1, title: 'The Matrix', genre: 'Sci-Fi' },
      { id: 2, title: 'Inception', genre: 'Action' },
      { id: 3, title: 'Interstellar', genre: 'Adventure' }
    ]);
  }
}
