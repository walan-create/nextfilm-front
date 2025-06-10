import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { MovieDetailsComponent } from '../../components/movieDetails/movieDetails.component';

@Component({
  selector: 'app-create-film-page',
  imports: [MovieDetailsComponent],
  templateUrl: './createFilm-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFilmPageComponent {


  router = inject(Router);

  movieService = inject(MoviesService);



  movieResource = rxResource({
    request: () => ({ }),
    loader: ({request} ) => {
      return this.movieService.getMovieById('');
    }
  }) // OBTIENE LA PELÍCULA POR ID, el rxResource gestiona el estado de la petición y el error

  // Efecto para redirigir al usuario si hay un error en la petición
  redirectEffect = effect( () => {
    if(this.movieResource.error()){
      this.router.navigate(['/admin']);
    }
  });
}
