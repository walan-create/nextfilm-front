import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';
import { Movie } from '../../interfaces/movie.interface';
import { MoviesService } from '../../services/movies.service';
import { NgClass, TitleCasePipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { FilterByTextPipe } from '../../pipes/filter-by-text.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies-admin',
  imports: [
    RouterLink,
    ReusableModalComponent,
    NgClass,
    TitleCasePipe,
    DatePipe,
    FormsModule,
    OrderByPipe,
    FilterByTextPipe
  ],
  templateUrl: './movies-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesAdminComponent implements AfterViewInit {

  public authService = inject(AuthService);
  public moviesService = inject(MoviesService);

  // Variables para ordenación
  public orderBy: keyof Movie = 'title';
  public orderDirection: 'asc' | 'desc' = 'asc';
  // Variable para búsqueda activa por texto
  public searchText: string = '';

  // Señal computada que escucha al invitations GLOBAL del Service (Cualquier actualización se verá reflejada)
  public movies = computed(() => this.moviesService.movies());
  // movies = computed(() => this.moviesResource.value());
  public movieIdToDelete = signal<string>('');

  @ViewChild(ReusableModalComponent)
  public reusableModal!: ReusableModalComponent;

  public ngAfterViewInit() {
    // Cargar las peliculas al iniciar el componente
    this.loadMovies();
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

  public openDeleteMovieModal(movieId: string) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.movieIdToDelete.set(movieId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  public handleDeleteMovie() {
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
