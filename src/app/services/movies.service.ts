import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth/services/auth.service';
import { Movie } from '../interfaces/movie.interface';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { MovieGenre } from '../interfaces/movie-genre.enum';
import { DataMoviesNews } from '../interfaces/data-movies-news.interface';

const emptyMovie: Movie = {
  _id: '',
  title: '',
  genre: MovieGenre.Action,
  release: new Date(),
  director: '',
  duration: 0,
  stock: 0,
  rental_price: 0,
  description: '',
};

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private cacheHomeInfo: DataMoviesNews | null = null; // Caché para los datos de home
  movies = signal<Movie[]>([]); // Aquí se almacenan las peliculas cargados

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${baseUrl}/getFilms`).pipe(
      tap((movies) => {
        this.movies.set(movies);
        localStorage.setItem('movies', JSON.stringify(movies));
      }),
      catchError((error) => {
        console.error('Error loading movies:', error);
        return of([]); // Devuelve un array vacío para mantener el flujo
      })
    );
  }

  getMovieById(id: string): Observable<Movie> {
    if (!id) {
      return of(emptyMovie);
    }

    // Verifica si el hotel con el ID existe en el caché
    const cachedHotel = this.movies().find((movie) => movie._id === id);
    if (cachedHotel) {
      return of(cachedHotel); // Devuelve el hotel desde el caché
    }

    // Si no está en el caché, realiza una petición HTTP
    return this.http.get<Movie>(`${baseUrl}/getFilm/${id}`).pipe(
      tap((movie) => {
        // console.log(movie); // Debug: imprime la película
        this.movies.update((movies) => [...movies, movie]); // Agrega al caché
      }),
      catchError((error) => {
        console.error('Error fetching the movie:', error);
        return of(emptyMovie);
      })
    );
  }

  createMovie(movieData: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${baseUrl}/newFilm`, movieData).pipe(
      tap((movie) => this.movies().push(movie)),
      catchError((error) => {
        console.error('Error creating the movie:', error);
        return of(emptyMovie);
      })
    );
  }

  updateMovie(id: string, movieData: Partial<Movie>): Observable<Movie> {
    // console.log(movieData);
    return this.http.put<Movie>(`${baseUrl}/updateFilm/${id}`, movieData).pipe(
      tap((updatedMovie) => {
        // Actualiza el caché local con el hotel actualizado
        this.movies.update((movies) =>
          movies.map((movie) => (movie._id === id ? updatedMovie : movie))
        );
      }),
      catchError((error) => {
        console.error('Error fetching the movie:', error);
        return of(emptyMovie);
      })
    );
  }

  deletemovie(movieId: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/deleteFilm/${movieId}`).pipe(
      tap(() => {
        this.movies.update((movies) =>
          movies.filter((movie) => movie._id !== movieId)
        );
        localStorage.setItem('movies', JSON.stringify(this.movies()));
      })
    );
  }

  loadMovies(): Observable<Movie[]> {
    return this.getAllMovies();
  }

  getLocalmovies(): Movie[] {
    const stored = localStorage.getItem('movies');
    return stored ? JSON.parse(stored) : [];
  }

  getHomeInfo(): Observable<DataMoviesNews> {
    if (this.cacheHomeInfo) {
      // Si datos en caché, los devuelve
      return of(this.cacheHomeInfo);
    }

    return this.http.get<DataMoviesNews>(`${baseUrl}/filmNews`).pipe(
      tap((data) => {
        this.cacheHomeInfo = data;
      }),
      catchError((error) => {
        console.error('Error fetcheando home data' + error);
        return of({
          LatestFilm: emptyMovie,
          TotalFilms: 0,
          OldestFilm: emptyMovie,
          CheapestFilm: emptyMovie,
          LonguestFilm: emptyMovie,
          ExpensiveFilm: emptyMovie,
        });
      })
    );
  }
}
