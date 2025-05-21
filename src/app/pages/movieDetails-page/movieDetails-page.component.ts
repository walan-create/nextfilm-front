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
import { FormErrorLabelComponent } from "../../components/form-error-label/form-error-label.component";

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
    release: [0, [Validators.required], []],
    director: ['', [Validators.required], []],
    duration: [0, [Validators.required], []],
    stock: [0, [Validators.required], []],
    rental_price: [0, [Validators.required], []],
    description: ['', [Validators.required], []],
  });

  private setFormValue(formLike: Movie) {
    this.movieForm.patchValue(formLike as Partial<Movie>);
  }

  ngOnInit(): void {
    this.setFormValue(this.movie());
  }

  async onSubmit() {
    const isValid = this.movieForm.valid;
    this.movieForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.movieForm.value as Movie;


    //obtengo los  datos de el formulario ya formateados

    if (this.movie().id === 'new') {
      const product = await firstValueFrom(
        this.movieService.createMovie(formValue)
      ); // si es new creo el producto y navego a la dirección del producto creado
      this.router.navigate(['/movie/info', product.id]);
    } else
      await firstValueFrom(
        this.movieService.updateMovie(
          this.movie().id,
          formValue
        )
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
