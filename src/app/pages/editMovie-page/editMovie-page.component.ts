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
  );



  // movie : Movie = {
  //   _id: '1',
  //       title: 'The Godfather',
  //       genre: MovieGenre.Drama,
  //       release: new Date('1972-03-24'),
  //       director: 'Francis Ford Coppola',
  //       duration: 175,
  //       stock: 5,
  //       rental_price: 20,
  //       description: 'Classic mafia movie.',
  // }

  movieResource = rxResource({
    request: () => ({ id : this.movieId()}),
    loader: ({request} ) => {
      return this.movieService.getMovieById(request.id);
    }
  })


  redirectEffect = effect( () => {
    if(this.movieResource.error()){
      this.router.navigate(['/admin']);
    }
  });
}
