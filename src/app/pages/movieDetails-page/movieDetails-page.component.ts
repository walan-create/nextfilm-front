import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FormErrorLabelComponent } from '../../components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form.utils';

@Component({
  selector: 'app-movie-details-page',
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './movieDetails-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsPageComponent {
  movie = input.required<Movie>();

  private router = inject(Router);

  private movieService = inject(MoviesService);

  private genre = signal<MovieGenre>(MovieGenre.Action);

  genres = [
    MovieGenre.Action,
    MovieGenre.Horror,
    MovieGenre.Comedy,
    MovieGenre.SciFi,
    MovieGenre.Drama,
    MovieGenre.Animated,
    MovieGenre.Musical,
  ];

  cambiado = signal(false);

  wasSaved = signal(false);

  fb = inject(FormBuilder);

  // title: string;
  // genre: MovieGenre;
  // release: number; // Pasar a Date o String (Pendiente de back)
  // director: string;
  // duration: number;
  // stock: number;
  // rental_price: number;
  // description: string;

  movieForm = this.fb.group({
    title: ['', [Validators.required], []],
    genre: ['', [Validators.required], []],
    release: [
      '',
      [Validators.required,
        // Validators.pattern(FormUtils.datePattern)
      ],
      [],
    ],
    director: ['', [Validators.required], []],
    duration: [0, [Validators.required], []],
    stock: [0, [Validators.required], []],
    rental_price: [0, [Validators.required], []],
    description: ['', [Validators.required], []],
  });

  private setFormValue(formLike: Movie) {
    this.movieForm.patchValue(formLike as any);

    //  const year = formLike.release.getFullYear();
    //   // Month is 0-indexed, so add 1 and pad with leading zero if needed
    //   const month = String(formLike.release.getMonth() + 1).padStart(2, '0');
    //   // Day of month (getDate, not getDay which is day of week)
    //   const day = String(formLike.release.getDate()).padStart(2, '0');

    //   this.movieForm.patchValue({
    //     release: `${year}-${month}-${day}`
    //   });


  if (formLike.release) {
    let releaseDate: Date;

    if (formLike.release instanceof Date) {
      releaseDate = formLike.release;
    } else {
      releaseDate = new Date(formLike.release);
    }

    if (!isNaN(releaseDate.getTime())) {
      const year = releaseDate.getFullYear();
      const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
      const day = String(releaseDate.getDate()).padStart(2, '0');

      this.movieForm.patchValue({
        release: `${year}-${month}-${day}`
      });
    } else {
      // If date is invalid, set an empty value
      this.movieForm.patchValue({ release: '' });
      console.warn('Invalid release date received:', formLike.release);
    }
  }

  }

  ngOnInit(): void {
    this.setFormValue(this.movie());
  }

  async onSubmit() {
    const isValid = this.movieForm.valid;
    this.movieForm.markAllAsTouched();
    this.cambiado.set(!this.cambiado());

    if (!isValid) return;

    const formValue  = this.movieForm.value ;

    const movieLike : Partial<Movie>= {
      ...formValue as any,
      release: new Date(formValue.release ?? ''),
    }

    console.log(movieLike);
    //obtengo los  datos de el formulario ya formateados

    if (this.movie()._id === '') {
      const product = await firstValueFrom(
        this.movieService.createMovie(movieLike)
      ); // si es new creo el producto y navego a la dirección del producto creado
      this.router.navigate(['/movies/info', product._id]);
    } else
      await firstValueFrom(
        this.movieService.updateMovie(this.movie()._id, movieLike)
      ); // si no es  nuevo sólo lo actualizo

    this.wasSaved.set(true); // activar mensaje de guardado

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 2000); // desactivar mensaje de guardadod a los dos segundos
  }

  onGenreClick(genre: string) {
    this.genre.set(genre as MovieGenre);

    this.movieForm.patchValue({ genre: genre });
  }
}
