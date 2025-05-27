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



// INICIALIZA EL FORMULARIO REACTIVO
  movieForm = this.fb.group({
    title: ['', [Validators.required], []],
    genre: ['', [Validators.required], []],
    release: [
      '',
      [Validators.required],
      [],
    ],
    director: ['', [Validators.required], []],
    duration: [0, [Validators.required], []],
    stock: [0, [Validators.required], []],
    rental_price: [0, [Validators.required], []],
    description: ['', [Validators.required], []],
  });


  // AÑADE LOS DATOS DE LA PELICULA QUE NOS PASAN AL FORMULARIO
  private setFormValue(formLike: Movie) {
    this.movieForm.patchValue(formLike as any);



  if (formLike.release) {

    let releaseDate: Date =  new Date(formLike.release);


    if (!isNaN(releaseDate.getTime())) { // SI LA FECHA ES VÁLIDA
      const year = releaseDate.getFullYear();
      const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
      const day = String(releaseDate.getDate()).padStart(2, '0');

      this.movieForm.patchValue({ // AÑADE LA FECHA A EL FORMULARIO
        release: `${year}-${month}-${day}`
      });
    } else {
      // SI LA FECHA NO ES VÁLIDA, LIMPIA EL CAMPO
      this.movieForm.patchValue({ release: '' });
      console.warn('Invalid release date received:', formLike.release);
    }
  }

  }

  ngOnInit(): void {
    this.setFormValue(this.movie());
  }

  async onSubmit() {
    // Validar el formulario
    const isValid = this.movieForm.valid;
    this.movieForm.markAllAsTouched();
    //MARCA EL CAMPO CAMBIADO PARA PODER ACTUALIZAR LOS MENSAJES DE ERROR
    this.cambiado.set(!this.cambiado());

    if (!isValid) return;

    //OBTINEN LOS VALORES DEL FORMULARIO
    const formValue  = this.movieForm.value ;

    // CREA UN OBJETO PARCIAL DE PELICULA CON LOS VALORES DEL FORMULARIO
    const movieLike : Partial<Movie>= {
      ...formValue as any,
      release: new Date(formValue.release ?? ''),
    }

    console.log(movieLike);

    if (this.movie()._id === '') { // SI NO TENGO ID ES NUEVO
      const product = await firstValueFrom(
        this.movieService.createMovie(movieLike) // si es new creo el producto y navego a la dirección del producto creado
      );
      this.router.navigate(['/movies/info', product._id]); // navego a la dirección del producto creado
    } else
      await firstValueFrom(
        this.movieService.updateMovie(this.movie()._id, movieLike) // si no es nuevo lo actualizo
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
