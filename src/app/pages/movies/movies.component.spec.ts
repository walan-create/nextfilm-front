import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { provideHttpClient } from '@angular/common/http';
import { MoviesService } from '../../services/movies.service';
import { RentalsService } from '../../services/rentals.service';
import { Movie } from '../../interfaces/movie.interface';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { Rental } from '../../interfaces/rental.interface';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { FilterByTextPipe } from '../../pipes/filter-by-text.pipe';

//Mocks de los servicios de MoviesComponent
const mockMovies: Movie[] = [
  {
    _id: '1',
    title: 'Test Movie',
    genre: MovieGenre.Action,
    release: new Date(),
    director: 'Test Director',
    duration: 120,
    stock: 5,
    rental_price: 10,
    description: 'A test movie',
  },
];

const mockRentals: Rental[] = [
  {
  _id: '1',
  userId: '2',
  filmId: '3',
  userName: 'Pepe',
  filmName: 'Ejemplo',
  price: 10,
  bookDate: null,
  rentalDate: null, // formato ISO (YYYY-MM-DD)
  expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
  returnDate: null, // formato ISO (YYYY-MM-DD)
  }
];

@Pipe({
  name: 'orderBy'
})
export class MockOrderByPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value
  }
}

@Pipe({
  name: 'filterByText'
})
export class MockFliterByTextPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value
  }
}

class MoviesServiceMock {
  movies = signal<Movie[]>([])
  loadMovies = jasmine.createSpy('loadMovies').and.returnValue(of([]))

}

class RentalsServiceMock {
   loadUserRentals = jasmine.createSpy('loadUserRentals').and.returnValue(of([]));
   userRentals = jasmine.createSpy('userRentals');
   createBook = jasmine.createSpy('createBook');
}

describe('MoviesComponent', () => {

    let fixture: ComponentFixture<MoviesComponent>;
    let compiled: HTMLElement;
    let component: MoviesComponent;
    let moviesService: MoviesServiceMock;
    let rentalsService: RentalsServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, MockOrderByPipe, MockFliterByTextPipe],
      providers: [
        provideHttpClient(),
        {provide: MoviesService, useClass: MoviesServiceMock },
        {provide: RentalsService, useClass: RentalsServiceMock },
        {provide: OrderByPipe, useValue: MockOrderByPipe},
        {provide: FilterByTextPipe, useValue: MockFliterByTextPipe}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as unknown as MoviesServiceMock;
    rentalsService = TestBed.inject(RentalsService) as unknown as RentalsServiceMock;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  it('should call loadMovies and reload moviesResource on ngOnInit', () => {
    moviesService.loadMovies.and.returnValue(of(mockMovies))
    spyOn(component.moviesResource, 'reload');

    component.ngOnInit();

    expect(moviesService.loadMovies).toHaveBeenCalled();
    expect(component.moviesResource.reload).toHaveBeenCalled();
});

  it('should update the movies signal', () => {
    moviesService.movies.set(mockMovies)

    expect(component.movies()).not.toBeNull()
    expect(component.movies()).toBe(mockMovies)
  })

  it('should throw an error message when loadMovies fails', () => {
    moviesService.loadMovies.and.returnValue(
      throwError(() => ({error: {error: 'Error al cargar el recurso'}}))
    )
    component.ngOnInit();

    expect(moviesService.loadMovies).toHaveBeenCalled();
  })

  it('should load moviesResource', async() => {
  rentalsService.loadUserRentals.and.returnValue(of(mockRentals));

  fixture.detectChanges()

  component.moviesResource.reload();

  await fixture.whenStable();

  expect(rentalsService.loadUserRentals).toHaveBeenCalled();

  const result = component.moviesResource.value();
  expect(result).toEqual(mockRentals);
  } )

  describe('hasActiveReservation', () => {
    it('returns true if the movie has been reservated', () => {
      const testMovieId = mockMovies[0]._id
      const mockRentals = [
        {filmId: mockMovies[0]._id, returnDate: null}
      ]
      rentalsService.userRentals.and.returnValue(mockRentals);
      expect(component.hasActiveReservation(testMovieId)).toBeTrue();
    })

    it('returns false if return date is false', () => {
      const testMovieId = mockMovies[0]._id
      const mockRentals = [
        {filmId: mockMovies[0]._id, returnDate: new Date()}
      ]
      rentalsService.userRentals.and.returnValue(mockRentals);
      expect(component.hasActiveReservation(testMovieId)).toBeFalse();
    })

    it('returns false if the movie has not been reservated', () => {
      const testMovieId = mockMovies[0]._id
      const mockRentals = [
        {filmId: '46', returnDate: null}
      ]
      rentalsService.userRentals.and.returnValue(mockRentals);
      expect(component.hasActiveReservation(testMovieId)).toBeFalse();
      component['loadMovies']
    })
  })

  describe('onReserveClick', () => {
    it('should call createBook and set guardadoOk to true on success', fakeAsync(() => {
      const testMovie = mockMovies[0];
      const mockRental = {filmId: testMovie._id, returnDate: null}

      rentalsService.createBook.and.returnValue(of(mockRental))
      rentalsService.loadUserRentals.and.returnValue(of(mockRental))

      component.onReserveClick(testMovie)

      expect(component.movieId()).not.toBeNull()
      expect(component.movieId()).toBe(testMovie._id)
      expect(rentalsService.createBook).toHaveBeenCalledWith(testMovie._id)
      expect(rentalsService.loadUserRentals).toHaveBeenCalled()
      expect(component.guardadoOk()).toBeTrue()

      tick(2001)
      expect(component.guardadoOk()).toBeFalse()
    }))

    it('should fail and show error message on fail', fakeAsync(() => {
      const testMovie = mockMovies[0];
      const errorMsg = 'Fallo al realizar la reserva'

      rentalsService.createBook.and.returnValue(
        throwError(() => ({error: {error: errorMsg}}))
      )
      component.onReserveClick(testMovie)
      expect(component.guardadoError()).toBe(errorMsg)
      tick(2001)
      expect(component.guardadoError()).toBe('')
    }))
  })
})
