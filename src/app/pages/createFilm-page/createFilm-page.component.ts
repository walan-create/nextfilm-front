import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { MovieDetailsPageComponent } from "../movieDetails-page/movieDetails-page.component";

@Component({
  selector: 'app-create-film-page',
  imports: [MovieDetailsPageComponent],
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
  })


  redirectEffect = effect( () => {
    if(this.movieResource.error()){
      this.router.navigate(['/admin']);
    }
  });
}
