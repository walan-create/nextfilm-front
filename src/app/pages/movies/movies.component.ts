import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../interfaces/movie.interface';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { FormsModule } from '@angular/forms';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { FilterByTextPipe } from '../../pipes/filter-by-text.pipe';
import { RentalsService } from '../../services/rentals.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movies',
  imports: [
    RouterLink,
    NgClass,
    TitleCasePipe,
    DatePipe,
    FormsModule,
    OrderByPipe,
    FilterByTextPipe,
  ],
  templateUrl: './movies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {

  authService = inject(AuthService);
  moviesService = inject(MoviesService);
  rentalsService = inject(RentalsService);

  movieId = signal<string | null>(null);

  // Variables para ordenación
  orderBy: keyof Movie = 'title';
  orderDirection: 'asc' | 'desc' = 'asc';
  // Variable para busqueda activa por texto
  searchText: string = '';

  guardadoOk = signal(false);
  guardadoError = signal<string>('');

  // Señal computada que escucha al invitations GLOBAL del Service (Cualquier actualización se verá reflejada)
  movies = computed(() => this.moviesService.movies());

  ngOnInit() {
    // Cargar las peliculas al iniciar el componente
    this.loadMovies();
    this.moviesResource.reload();
    // this.moviesService.movies.set(this.testMovies); //! Mock de prueba
    // console.log(this.movies());
  }

  moviesResource = rxResource({
    loader: () => this.rentalsService.loadUserRentals(),
  });

  public hasActiveReservation(movieId: string): boolean {
    // Busca si hay una reserva activa (sin returnDate) para la película y el usuario actual
    const userRentals = this.rentalsService.userRentals();
    return userRentals.some(
      (rental) => rental.filmId === movieId && rental.returnDate === null // o !rental.returnDate
    );
  }

  public onReserveClick(movie: Movie) {
    this.movieId.set(movie._id);
    this.rentalsService.createBook(movie._id).subscribe({
      next: (rental) => {
        // Recarga las reservas del usuario para refrescar el botón y mostrarlo desactivado
        this.rentalsService.loadUserRentals().subscribe();

        this.guardadoOk.set(true); // si todo va bien, se activa el mensaje de guardado

        setTimeout(() => {
          this.guardadoOk.set(false);
        }, 2000); 
      },
      error: (err) => {
        this.guardadoError.set(err.error.error); // si hay error, se activa el mensaje de error

        setTimeout(() => {
          this.guardadoError.set('');
        }, 2000);
      },
    });
  }

    private loadMovies() {
    this.moviesService.loadMovies().subscribe({
      next: (movies) => {
        // Actualizar el signal con las peliculas obtenidas
        this.moviesService.movies.set(movies);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
      },
    });
  }
}
