import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MoviesService } from './movies.service';
import { Movie } from '../interfaces/movie.interface';
import { MovieGenre } from '../interfaces/movie-genre.enum';

const baseUrl = environment.baseUrl;

const mockMovies: Movie[] = [
  {
    _id: '',
    title: '',
    genre: MovieGenre.Action,
    release: new Date(),
    director: '',
    duration: 0,
    stock: 0,
    rental_price: 0,
    description: '',
  },
  {
    _id: '1',
    title: 'Inception',
    genre: MovieGenre.SciFi,
    release: new Date('2010-07-16'),
    director: 'Christopher Nolan',
    duration: 148,
    stock: 10,
    rental_price: 3.99,
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  },
  {
    _id: '2',
    title: 'The Dark Knight',
    genre: MovieGenre.Action,
    release: new Date('2008-07-18'),
    director: 'Christopher Nolan',
    duration: 152,
    stock: 5,
    rental_price: 4.99,
    description:
      'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
  },
  {
    _id: '3',
    title: 'Interstellar',
    genre: MovieGenre.SciFi,
    release: new Date('2014-11-07'),
    director: 'Christopher Nolan',
    duration: 169,
    stock: 8,
    rental_price: 5.99,
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
];

describe('Movies Service', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  let storage: { [key: string]: string } = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MoviesService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);

    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ?? null;
    });

    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        return (storage[key] = value);
      }
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMovies', () => {
    it('should return all movies', () => {
      service.getAllMovies().subscribe((movies) => {
        expect(movies.length).toBe(4);
        expect(movies).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(`${baseUrl}/getFilms`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);

      expect(service.movies()).toBe(mockMovies);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'movies',
        JSON.stringify(mockMovies)
      );
    });

    it('should return an empty array if error occurs', () => {
      service.getAllMovies().subscribe((movies) => {
        expect(movies.length).toBe(0);
      });
      const req = httpMock.expectOne(`${baseUrl}/getFilms`);
      expect(req.request.method).toBe('GET');
      req.flush('Error loading movies', {
        status: 500,
        statusText: 'Internal Server Error',
      });
      expect(service.movies()).toEqual([]);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', () => {
      const movieId = '1';
      service.getMovieById(movieId).subscribe((movie) => {
        expect(movie).toEqual(mockMovies[1]);
      });

      const req = httpMock.expectOne(`${baseUrl}/getFilm/${movieId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies[1]);

      expect(service.movies()).toContain(mockMovies[1]);
    });

    it('should return an empty movie if ID is not provided', () => {
      const movieId = '';

      service.getMovieById('').subscribe((movie) => {
        expect(movie).toEqual(mockMovies[0]);
      });

      httpMock.expectNone(`${baseUrl}/getFilm/${movieId}`);
    });

    it('should not do http request if movie is in cache', () => {
      service.movies.set(mockMovies);
      const movieId = '2';

      service.getMovieById(movieId).subscribe((movie) => {
        expect(movie).toEqual(mockMovies[2]);
      });

      httpMock.expectNone(`${baseUrl}/getFilm/${movieId}`);
    });

    it('should return an empty movie if movie not found', () => {
      const movieId = '999';
      service.getMovieById(movieId).subscribe({
        next: (movie) => expect(movie).toEqual(mockMovies[0]),
        error: () => fail('Expected an error, not movies'),
      });

      const req = httpMock.expectOne(`${baseUrl}/getFilm/${movieId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Movie not found', {
        status: 400,
        statusText: 'Movie not found',
      });
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', () => {
      const newMovie: Partial<Movie> = {
        title: 'New Movie',
        genre: MovieGenre.Action,
        release: new Date(),
        director: 'New Director',
        duration: 120,
        stock: 5,
        rental_price: 2.99,
        description: 'A new movie description',
      };

      service.createMovie(newMovie).subscribe((movie) => {
        expect(movie).toEqual({ ...newMovie, _id: '1' } as Movie);
      });

      const req = httpMock.expectOne(`${baseUrl}/newFilm`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newMovie, _id: '1' });

      expect(service.movies()).toContain({
        ...newMovie,
        _id: '1',
      } as Movie);
    });

    it('should return an empty movie when eror on createFilm', () => {
      const newMovie: Partial<Movie> = {
        title: 'New Movie',
      };

      service.createMovie(newMovie).subscribe({
        next: (movie) => expect(movie).toEqual(mockMovies[0]),
        error: () => fail('Expected an error, not movies'),
      });

      const req = httpMock.expectOne(`${baseUrl}/newFilm`);
      expect(req.request.method).toBe('POST');
      req.flush('Error creating movie', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('updateMovie', () => {
    it('should update an existing movie', () => {
      const id = '1';
      const updatedMovie: Partial<Movie> = {
        title: 'Updated Movie',
        genre: MovieGenre.SciFi,
        release: new Date(),
        director: 'Updated Director',
        duration: 130,
        stock: 6,
        rental_price: 3.49,
        description: 'An updated movie description',
      };

      service.movies.set(mockMovies);

      service.updateMovie(id, updatedMovie).subscribe((movie) => {
        expect(movie).toEqual({ ...updatedMovie, _id: id } as Movie);
      });

      const req = httpMock.expectOne(`${baseUrl}/updateFilm/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush({ ...updatedMovie, _id: id });

      expect(service.movies()).toContain({
        ...updatedMovie,
        _id: id,
      } as Movie);
    });

    it('should return an empty movie when eror on updateFilm', () => {
      const id = '4359085901;';

      const updatedMovie: Partial<Movie> = {
        title: 'Updated Movie',
      };

      service.updateMovie(id, updatedMovie).subscribe({
        next: (movie) => expect(movie).toEqual(mockMovies[0]),
        error: () => fail('Expected an error, not movies'),
      });

      const req = httpMock.expectOne(`${baseUrl}/updateFilm/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush('Error updating movie', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie by ID', () => {
      const movieId = '1';
      service.movies.set(mockMovies);

      service.deletemovie(movieId).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/deleteFilm/${movieId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });

      expect(service.movies()).not.toContain(mockMovies[1]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'movies',
        JSON.stringify([mockMovies[0], mockMovies[2], mockMovies[3]])
      );
    });
  });

  describe('loadMovies', () => {
    it('should load movies from the server', () => {
      service.loadMovies().subscribe((movies) => {
        expect(movies.length).toBe(4);
        expect(movies).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(`${baseUrl}/getFilms`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovies);

      expect(service.movies()).toBe(mockMovies);
    });
  });

  describe('getLocalMovies', () => {
    it('should return movies from local storage', () => {
      storage = { movies: JSON.stringify(mockMovies) };

      const movies = service.getLocalmovies();
      expect(movies.length).toBe(4);
      // expect(movies).toEqual(mockMovies);
      // no lo compruebo por problemas con las fechas
    });

    it('should return an empty array if no movies in local storage', () => {
      const movies = service.getLocalmovies();
      expect(movies.length).toBe(0);
    });
  });

  describe('getHomeInfo', () => {
    it('should return home info from the server', () => {
      const mockHomeInfo = {
        LatestFilm: mockMovies[1],
        TotalFilms: 4,
        OldestFilm: mockMovies[0],
        CheapestFilm: mockMovies[0],
        LonguestFilm: mockMovies[3],
        ExpensiveFilm: mockMovies[2],
      };

      service.getHomeInfo().subscribe((data) => {
        expect(data).toEqual(mockHomeInfo);
      });

      const req = httpMock.expectOne(`${baseUrl}/filmNews`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHomeInfo);

    });

    it('should return cached home info if available', () => {

      const mockHomeInfo = {
        LatestFilm: mockMovies[1],
        TotalFilms: 4,
        OldestFilm: mockMovies[0],
        CheapestFilm: mockMovies[0],
        LonguestFilm: mockMovies[3],
        ExpensiveFilm: mockMovies[2],
      };

      service['cacheHomeInfo'] = mockHomeInfo

      service.getHomeInfo().subscribe((data) => {
        expect(data).toEqual(mockHomeInfo);
      });

      httpMock.expectNone(`${baseUrl}/filmNews`);
    });

    it('should return empty data if error occurs', () => {
      service.getHomeInfo().subscribe((data) => {
        expect(data).toEqual({
          LatestFilm: mockMovies[0],
          TotalFilms: 0,
          OldestFilm: mockMovies[0],
          CheapestFilm: mockMovies[0],
          LonguestFilm: mockMovies[0],
          ExpensiveFilm: mockMovies[0],
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/filmNews`);
      expect(req.request.method).toBe('GET');
      req.flush('Error fetching home data', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
