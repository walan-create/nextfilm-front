import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Movie } from '../../interfaces/movie.interface';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-movie-info',
  imports: [RouterOutlet, TitleCasePipe],
  templateUrl: './movie-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieInfoComponent {

  // Pelicula de prueba (MOCK)
  testMovie: Movie = {
    id: '3',
    title: '28 días después',
    genre: MovieGenre.Horror,
    release: new Date('1972-03-24'),
    director: 'danny boyle',
    duration: 113,
    stock: 8,
    rental_price: 4.99,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta nam molestias...'
  }


  moviesService = inject(MoviesService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  movieId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['id'])
    )
  )

  ngOnInit(): void {
    // Cargar la pelicula al iniciar el componente
    this.moviesService.getMovieById(this.movieId.toString());
  }


  movieResourcee = this.testMovie; //cambiar este por el de abajo
  // movieResource = rxResource({
  //   request: () => ({ id: this.movieId() }),
  //   loader: ({ request }) => {
  //     return this.moviesService.getMovieById(request.id)
  //   }
  // })

}
