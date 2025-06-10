import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  Component,
  input,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  signal,
  InputSignal,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { FormErrorLabelComponent } from '../../components/form-error-label/form-error-label.component';
import { MovieDetailsComponent } from './movieDetails.component';
import { of } from 'rxjs';
import { Movie } from '../../interfaces/movie.interface';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  template: '<div class="text-danger">{{ errorMessage }}</div>',
})
class MockFormErrorLabelComponent {
  control = input.required<AbstractControl>();
  valido = input<boolean>(false);

  get errorMessage() {
    const error = this.control().errors || {};

    return this.control().touched && Object.keys(error).length > 0
      ? 'Alun Error'
      : null;
  }
}

const emptyMovie: Movie = {
  _id: '',
  title: '',
  genre: MovieGenre.Action,
  release: new Date(),
  director: '',
  duration: 0,
  stock: 0,
  rental_price: 0,
  description: '',
};

const mockMovie: Movie = {
  _id: '123abc',
  title: 'Pelicula de prueba',
  genre: MovieGenre.Action,
  release: new Date(),
  director: '',
  duration: 0,
  stock: 0,
  rental_price: 0,
  description: '',
};

const mockMovieNueva: Movie = {
  _id: '',
  title: 'Nueva Pelicula',
  genre: MovieGenre.Comedy,
  release: new Date('2023-10-01'),
  director: 'Director Test',
  duration: 120,
  stock: 10,
  rental_price: 5,
  description: 'Descripcion de prueba',
};

const mockMovieService = {
  createMovie: jasmine
    .createSpy('createMovie')
    .and.callFake((newMovie: Partial<Movie>) => {
      if (newMovie.title === 'Hola') return of(emptyMovie);
      return of(mockMovie);
    }),
  updateMovie: jasmine
    .createSpy('updateMovie')
    .and.callFake((id: string, newMovie: Partial<Movie>) => {
      if (newMovie.title === 'Hola') return of(emptyMovie);

      return of(mockMovie);
    }),
};

describe('Movie Details Component', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([
          { path: 'movies/info/:id', component: {} as any }, // para crear nuevoMovie
        ]),
        { provide: MoviesService, useValue: mockMovieService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .overrideComponent(MovieDetailsComponent, {
        remove: { imports: [FormErrorLabelComponent] },
        add: { imports: [MockFormErrorLabelComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailsComponent);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;
    component.movie = signal(mockMovie) as unknown as InputSignal<Movie>;

    mockMovieService.createMovie.calls.reset();
    mockMovieService.updateMovie.calls.reset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should set the form value with the input is called', () => {
      expect(component.movieForm.value).toEqual({
        title: mockMovie.title,
        genre: mockMovie.genre,
        release: mockMovie.release.toISOString().split('T')[0],
        director: mockMovie.director,
        duration: mockMovie.duration,
        stock: mockMovie.stock,
        rental_price: mockMovie.rental_price,
        description: mockMovie.description,
      });
    });
  });

  describe('Form Submission', () => {
    describe('whenCreating a new movie', () => {
      it('should call createMovie when the form is valid and _id is not provided (new movie)', async () => {
        component.movie = signal(
          mockMovieNueva
        ) as unknown as InputSignal<Movie>;
        component.ngOnInit();
        fixture.detectChanges();

        spyOn(router, 'navigate');

        await component.onSubmit();
        expect(mockMovieService.createMovie).toHaveBeenCalledWith({
          ...component.movieForm.value,
          release: new Date(component.movieForm.value.release ?? ''),
        });
        expect(router.navigate).toHaveBeenCalledWith([
          '/movies/info',
          mockMovie._id,
        ]);
      });

      it('should show error message if form submission fails', fakeAsync(() => {
        component.movie = signal(
          mockMovieNueva
        ) as unknown as InputSignal<Movie>;
        component.ngOnInit();
        fixture.detectChanges();

        component.movieForm.setValue({
          title: 'Hola',
          genre: MovieGenre.Action,
          release: '2023-10-01',
          director: 'Director',
          duration: 120,
          stock: 10,
          rental_price: 5,
          description: 'Description',
        });
        component.onSubmit().then(() => {
          expect(component.notSaved()).toBeTrue();

          tick(2001);

          expect(component.notSaved()).toBeFalse();
        });
      }));
    });

    describe('whenUpdating an existing movie', () => {
      it('should call updateMovie when the form is valid and movie is provided', fakeAsync(() => {
        component.movieForm.setValue({
          title: 'Pelicula Actualizada',
          genre: MovieGenre.Drama,
          release: '2023-10-01',
          director: 'Nuevo Director',
          duration: 150,
          stock: 20,
          rental_price: 10,
          description: 'Nueva descripcion',
        });

        component.onSubmit().then(() => {
          expect(mockMovieService.updateMovie).toHaveBeenCalledWith(
            mockMovie._id,
            {
              ...component.movieForm.value,
              release: new Date(component.movieForm.value.release ?? ''),
            }
          );
        });
      }));

      it('should show error message if form submission fails', fakeAsync(() => {
        component.movieForm.setValue({
          title: 'Hola',
          genre: MovieGenre.Action,
          release: '2023-10-01',
          director: 'Director',
          duration: 120,
          stock: 10,
          rental_price: 5,
          description: 'Description',
        });
        component.onSubmit().then(() => {
          expect(component.notSaved()).toBeTrue();

          tick(2001);

          expect(component.notSaved()).toBeFalse();
        });
      }));
    });

    it('should not submit the form if its invalid', async () => {
      component.movieForm.get('title')?.setValue('');
      component.movieForm.get('genre')?.setValue('');
      expect(component.movieForm.valid).toBeFalse();

      await component.onSubmit();

      expect(mockMovieService.createMovie).not.toHaveBeenCalled();
      expect(mockMovieService.updateMovie).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should mark the form as invalid if required fields are empty', () => {
      component.movieForm.get('title')?.setValue('');
      expect(component.movieForm.valid).toBeFalse();
    });

    it('should mark the form as valid when all required fields are filled', () => {
      component.movieForm.setValue({
        title: 'Valid Movie',
        genre: MovieGenre.Action,
        release: '2023-10-01',
        director: 'Director',
        duration: 120,
        stock: 10,
        rental_price: 5,
        description: 'Description',
      });
      expect(component.movieForm.valid).toBeTrue();
    });
  });

  describe('Genre Selection', () => {
    it('should update the genre when a new genre is selected', () => {
      const newGenre = 'horror';
      component.onGenreClick(newGenre);

      expect(component.movieForm.value.genre).toBe(newGenre);
    });
  });
});
