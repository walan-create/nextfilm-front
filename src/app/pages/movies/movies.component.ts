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
  // 1. Lista de películas de prueba (MOCK)
  // testMovies: Movie[] = [
  //   {
  //     _id: '1',
  //     title: 'The Godfather',
  //     genre: MovieGenre.Drama,
  //     release: new Date('1972-03-24'),
  //     director: 'Francis Ford Coppola',
  //     duration: 175,
  //     stock: 5,
  //     rental_price: 20,
  //     description: 'Classic mafia movie.',
  //   },
  //   {
  //     _id: '2',
  //     title: 'Inception',
  //     genre: MovieGenre.SciFi,
  //     release: new Date('1972-03-24'),
  //     director: 'Christopher Nolan',
  //     duration: 148,
  //     stock: 3,
  //     rental_price: 18,
  //     description: 'A mind-bending thriller.',
  //   },
  //   {
  //     _id: '3',
  //     title: 'Avengers: Endgame',
  //     genre: MovieGenre.Action,
  //     release: new Date('1972-03-24'),
  //     director: 'Russo Brothers',
  //     duration: 181,
  //     stock: 7,
  //     rental_price: 22,
  //     description: 'Epic superhero finale.',
  //   },
  //   {
  //     _id: '4',
  //     title: 'The Hangover',
  //     genre: MovieGenre.Comedy,
  //     release: new Date('1972-03-24'),
  //     director: 'Todd Phillips',
  //     duration: 100,
  //     stock: 4,
  //     rental_price: 15,
  //     description: 'A wild bachelor party in Las Vegas.',
  //   },
  //   {
  //     _id: '5',
  //     title: 'Friday the 13th',
  //     genre: MovieGenre.Horror,
  //     release: new Date('1972-03-24'),
  //     director: 'Sean S. Cunningham',
  //     duration: 95,
  //     stock: 6,
  //     rental_price: 17,
  //     description:
  //       'Camp counselors are stalked by a masked killer at Crystal Lake.',
  //   },
  //   {
  //     _id: '6',
  //     title: 'The Lion King',
  //     genre: MovieGenre.Animated,
  //     release: new Date('1972-03-24'),
  //     director: 'Roger Allers',
  //     duration: 88,
  //     stock: 8,
  //     rental_price: 16,
  //     description:
  //       'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
  //   },
  //   {
  //     _id: '7',
  //     title: 'La La Land',
  //     genre: MovieGenre.Musical,
  //     release: new Date('1972-03-24'),
  //     director: 'Damien Chazelle',
  //     duration: 128,
  //     stock: 5,
  //     rental_price: 19,
  //     description:
  //       'A jazz pianist falls for an aspiring actress in Los Angeles.',
  //   },
  // ];

  authService = inject(AuthService);
  moviesService = inject(MoviesService);
  rentalService = inject(RentalsService);

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

    // this.moviesService.movies.set(this.testMovies); //! Mock de prueba
    // console.log(this.movies());
  }

  loadMovies() {
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

  onReservarClick(movie: Movie) {
    this.movieId.set(movie._id);
    this.rentalService.createBook(movie._id).subscribe({
      next: (rental) => {
        this.guardadoOk.set(true); // si todo va bien, se activa el mensaje de guardado

        setTimeout(() => {
          this.guardadoOk.set(false);
        }, 2000); // desactivar mensaje de guardadod a los dos segundos
      },
      error: (err) => {
        this.guardadoError.set(err.error.error); // si hay error, se activa el mensaje de error

        setTimeout(() => {
          this.guardadoError.set('');
        }, 2000);
      },
    });
  }
}
