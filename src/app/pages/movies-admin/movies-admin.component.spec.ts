import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesAdminComponent } from './movies-admin.component';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '@auth/services/auth.service';
import { of, throwError } from 'rxjs';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  signal,
} from '@angular/core';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { ActivatedRoute } from '@angular/router';

const mockMovies = [
  {
    _id: '1',
    title: 'The Godfather',
    genre: MovieGenre.Drama,
    release: new Date('1972-03-24'),
    director: 'Francis Ford Coppola',
    duration: 175,
    stock: 5,
    rental_price: 20,
    description: 'Classic mafia movie.',
  },
  {
    _id: '2',
    title: 'Inception',
    genre: MovieGenre.SciFi,
    release: new Date('1972-03-24'),
    director: 'Christopher Nolan',
    duration: 148,
    stock: 3,
    rental_price: 18,
    description: 'A mind-bending thriller.',
  },
  {
    _id: '3',
    title: 'Avengers: Endgame',
    genre: MovieGenre.Action,
    release: new Date('1972-03-24'),
    director: 'Russo Brothers',
    duration: 181,
    stock: 7,
    rental_price: 22,
    description: 'Epic superhero finale.',
  },
  {
    _id: '4',
    title: 'The Hangover',
    genre: MovieGenre.Comedy,
    release: new Date('1972-03-24'),
    director: 'Todd Phillips',
    duration: 100,
    stock: 4,
    rental_price: 15,
    description: 'A wild bachelor party in Las Vegas.',
  },
  {
    _id: '5',
    title: 'Friday the 13th',
    genre: MovieGenre.Horror,
    release: new Date('1972-03-24'),
    director: 'Sean S. Cunningham',
    duration: 95,
    stock: 6,
    rental_price: 17,
    description:
      'Camp counselors are stalked by a masked killer at Crystal Lake.',
  },
  {
    _id: '6',
    title: 'The Lion King',
    genre: MovieGenre.Animated,
    release: new Date('1972-03-24'),
    director: 'Roger Allers',
    duration: 88,
    stock: 8,
    rental_price: 16,
    description:
      'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
  },
  {
    _id: '7',
    title: 'La La Land',
    genre: MovieGenre.Musical,
    release: new Date('1972-03-24'),
    director: 'Damien Chazelle',
    duration: 128,
    stock: 5,
    rental_price: 19,
    description: 'A jazz pianist falls for an aspiring actress in Los Angeles.',
  },
];

class MoviesServiceMock {
  loadMovies = jasmine.createSpy('loadMovies').and.returnValue(of(mockMovies));
  movies = signal(mockMovies);
  deletemovie = jasmine.createSpy('deletemovie').and.returnValue(of({}));
}

class AuthServiceMock {}

describe('MoviesAdminComponent', () => {
  let fixture: ComponentFixture<MoviesAdminComponent>;
  let component: MoviesAdminComponent;
  let moviesService: MoviesServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesAdminComponent],
      providers: [
        { provide: MoviesService, useClass: MoviesServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesAdminComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(
      MoviesService
    ) as unknown as MoviesServiceMock;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadMovies on ngAfterViewInit', () => {
    const spy = spyOn(component as any, 'loadMovies' as any).and.callThrough();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update movies signal after ngAfterViewInit', () => {
  component.ngAfterViewInit();
  expect(moviesService.loadMovies).toHaveBeenCalled();
});

  // Comprobar que se rendericen correctamente en el DOM.
  it('should render a list of movies', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const movieItems = compiled.querySelectorAll('.list-group-item-light');
    // Array de títulos renderizados en el DOM
    const renderedTitles = Array.from(movieItems).map(
      (item) => item.textContent?.trim() || ''
    );
    // Array de títulos del mock
    const mockTitles = mockMovies.map((movie) => movie.title);
    // Comprobar que cada título del mock está en los títulos renderizados
    mockTitles.forEach((title) => {
      expect(renderedTitles.some((text) => text.includes(title))).toBeTrue();
    });
    // Comprobar que no hay títulos extra
    expect(renderedTitles.length).toBe(mockTitles.length);
  });

  it('should open delete modal and set movie ID', () => {
    const movieId = '2';
    const modal = document.createElement('div');
    modal.id = 'reusableModal';
    document.body.appendChild(modal);

    // Mock de window.bootstrap.Modal
    (window as any).bootstrap = {
      Modal: function () {
        return { show: jasmine.createSpy('show') };
      },
    };

    component.openDeleteMovieModal(movieId);
    expect(component.movieIdToDelete()).toBe(movieId);

    document.body.removeChild(modal); // Limpieza
  });

  it('should call deletemovie when handleDeleteMovie is triggered', () => {
    component.movieIdToDelete.set('3');
    component.handleDeleteMovie();
    expect(moviesService.deletemovie).toHaveBeenCalledWith('3');
  });

  it('should handle error when loading movies', () => {
    moviesService.loadMovies.and.returnValue(
      throwError(() => new Error('error'))
    );
    spyOn(console, 'error');
    component.ngAfterViewInit();
    expect(console.error).toHaveBeenCalledWith(
      'Error loading movies:',
      jasmine.any(Error)
    );
  });

  it('should assign the movie id to delete', () => {
    (window as any).bootstrap = {
      Modal: function () {
        return { show: jasmine.createSpy('show') };
      },
    };
    component.openDeleteMovieModal('1');
    expect(component.movieIdToDelete()).toBe('1');
  });

  it('should call deletemovie and handle success', () => {
    spyOn(console, 'log');
    component.movieIdToDelete.set('1');
    component.handleDeleteMovie();
    expect(moviesService.deletemovie).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith('Movie deleted successfully');
  });

  it('should handle error when deleting movie', () => {
    moviesService.deletemovie.and.returnValue(
      throwError(() => new Error('error'))
    );
    spyOn(console, 'log');
    component.movieIdToDelete.set('1');
    component.handleDeleteMovie();
    expect(console.log).toHaveBeenCalledWith(
      'Error deleting the movie',
      jasmine.any(Error)
    );
  });
});
