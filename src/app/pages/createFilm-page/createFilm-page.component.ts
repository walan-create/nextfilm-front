import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-create-film-page',
  imports: [],
  templateUrl: './createFilm-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFilmPageComponent {


  router = inject(Router);

  movieService = inject(MoviesService);



  // movieResource = rxResource({
  //   request: () => ({ }),
  //   loader: ({request} ) => {
  //     return this.movieService.getMovieById(request.id);
  //   }
  // })


//   redirectEffect = effect( () => {
//     if(this.movieResource.error()){
//       this.router.navigate(['/admin']);
//     }
//   });
}
