import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { MoviesService } from '../../services/movies.service';
import { MovieDetailsPageComponent } from "../movieDetails-page/movieDetails-page.component";
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-edit-movie-page',
  imports: [MovieDetailsPageComponent],
  templateUrl: './editMovie-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMoviePageComponent {

  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);

  movieService = inject(MoviesService);

  private movieId = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['id'])
    )
  ); // obtiene el movieId de la ruta activa


  movieResource = rxResource({
    request: () => ({ id : this.movieId()}),
    loader: ({request} ) => {
      return this.movieService.getMovieById(request.id);
    }
  })// OBTIENE LA PELÍCULA POR ID, el rxResource gestiona el estado de la petición y el error

  // Efecto para redirigir al usuario si hay un error en la petición


  redirectEffect = effect( () => {
    if(this.movieResource.error()){
      this.router.navigate(['/admin']);
    }
  });
}
