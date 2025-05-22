import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MoviesService } from '../../services/movies.service';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';
import { Movie } from '../../interfaces/movie.interface';
import { NgClass, TitleCasePipe } from '@angular/common';
import { MovieGenre } from '../../interfaces/movie-genre.enum';

@Component({
  selector: 'app-movies',
  imports: [RouterLink, ReusableModalComponent, NgClass, TitleCasePipe],
  templateUrl: './movies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  // 1. Lista de películas de prueba (MOCK)
    testMovies: Movie[] = [
    {
      id: '1',
      title: 'The Godfather',
      genre: MovieGenre.Drama,
      release: new Date('1972-03-24'),
      director: 'Francis Ford Coppola',
      duration: 175,
      stock: 5,
      rental_price: 20,
      description: 'Classic mafia movie.',
    },
    {
      id: '2',
      title: 'Inception',
      genre: MovieGenre.SciFi,
      release: new Date('1972-03-24'),
      director: 'Christopher Nolan',
      duration: 148,
      stock: 3,
      rental_price: 18,
      description: 'A mind-bending thriller.',
    },
    {
      id: '3',
      title: 'Avengers: Endgame',
      genre: MovieGenre.Action,
      release: new Date('1972-03-24'),
      director: 'Russo Brothers',
      duration: 181,
      stock: 7,
      rental_price: 22,
      description: 'Epic superhero finale.',
    },
    {
      id: '4',
      title: 'The Hangover',
      genre: MovieGenre.Comedy,
      release: new Date('1972-03-24'),
      director: 'Todd Phillips',
      duration: 100,
      stock: 4,
      rental_price: 15,
      description: 'A wild bachelor party in Las Vegas.',
    },
    {
      id: '5',
      title: 'Friday the 13th',
      genre: MovieGenre.Horror,
      release: new Date('1972-03-24'),
      director: 'Sean S. Cunningham',
      duration: 95,
      stock: 6,
      rental_price: 17,
      description: 'Camp counselors are stalked by a masked killer at Crystal Lake.',
    },
    {
      id: '6',
      title: 'The Lion King',
      genre: MovieGenre.Animated,
      release: new Date('1972-03-24'),
      director: 'Roger Allers',
      duration: 88,
      stock: 8,
      rental_price: 16,
      description: 'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
    },
    {
      id: '7',
      title: 'La La Land',
      genre: MovieGenre.Musical,
      release: new Date('1972-03-24'),
      director: 'Damien Chazelle',
      duration: 128,
      stock: 5,
      rental_price: 19,
      description: 'A jazz pianist falls for an aspiring actress in Los Angeles.',
    }
  ];

  authService = inject(AuthService);
  moviesService = inject(MoviesService);

  // Señal computada que escucha al invitations GLOBAL del Service (Cualquier actualización se verá reflejada)
  movies = computed(() => this.moviesService.movies());
  movieIdToDelete = signal<string>('');

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    // Cargar las peliculas al iniciar el componente
    // this.loadMovies();

    this.moviesService.movies.set(this.testMovies); // Mock de prueba
  }

  openDeleteMovieModal(movieId: string) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.movieIdToDelete.set(movieId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  loadMovies() {
    this.moviesService.loadMovies().subscribe({
      next: (movies) => {
        // Actualizar el signal con los hoteles obtenidos
        this.moviesService.movies.set(movies);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
      },
    });
  }

  handleDeleteMovie() {
    this.moviesService.deletemovie(this.movieIdToDelete()).subscribe({
      next: () => {
        console.log('Movie deleted successfully');
      },
      error: (err) => {
        console.log('Error deleting the movie', err);
      },
    });
  }
}
