import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRentalComponent } from './new-rental.component';
import { ServiceNameServices } from '../../services/user.service';
import { MoviesService } from '../../services/movies.service';
import { RentalsService } from '../../services/rentals.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Movie } from '../../interfaces/movie.interface';
import { MovieGenre } from '../../interfaces/movie-genre.enum';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rental } from '../../interfaces/rental.interface';

describe('NewRentalComponent', () => {
  let component: NewRentalComponent;
  let fixture: ComponentFixture<NewRentalComponent>;
  let userServiceSpy: jasmine.SpyObj<ServiceNameServices>;
  let movieServiceSpy: jasmine.SpyObj<MoviesService>;
  let rentalServiceSpy: jasmine.SpyObj<RentalsService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('ServiceNameServices', ['getAllUsers']);
    movieServiceSpy = jasmine.createSpyObj('MoviesService', ['getAllMovies']);
    rentalServiceSpy = jasmine.createSpyObj('RentalsService', ['createRental']);

    // ¡Aquí ya defines los returnValue correctamente antes del detectChanges!
    userServiceSpy.getAllUsers.and.returnValue(of([]));
    movieServiceSpy.getAllMovies.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        NewRentalComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        { provide: ServiceNameServices, useValue: userServiceSpy },
        { provide: MoviesService, useValue: movieServiceSpy },
        { provide: RentalsService, useValue: rentalServiceSpy },
        { provide: Router, useValue: { navigate: () => { } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewRentalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // <-- ¡Solo después de definir los returnValue!
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios y películas correctamente en ngOnInit', () => {
    const mockUsers = [{ _id: 'u1' }];
    const mockMovies: Movie[] = [{
      _id: 'm1',
      title: 'Mock Movie',
      genre: MovieGenre.Action,
      release: new Date('2023-01-01'),
      director: 'Jane Doe',
      duration: 120,
      rental_price: 3.99,
      stock: 5,
      description: 'Test description'
    }];

    userServiceSpy.getAllUsers.and.returnValue(of(mockUsers));
    movieServiceSpy.getAllMovies.and.returnValue(of(mockMovies));

    component.ngOnInit();

    expect(component.users).toEqual(mockUsers);
    expect(component.movies).toEqual(mockMovies);
    expect(component.usersReady).toBeTrue();
    expect(component.moviesReady).toBeTrue();
    expect(component.loaded).toBeTrue();
  });

  it('debería establecer loaded en true si usersReady y moviesReady son true', () => {
    component.usersReady = true;
    component.moviesReady = true;

    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');
    component.checkLoaded();

    expect(component.loaded).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('debería actualizar el precio correctamente al seleccionar una película', () => {
    component.movies = [{
      _id: 'm1',
      title: 'Test Movie',
      genre: MovieGenre.Comedy,
      release: new Date('2020-01-01'),
      director: 'Director',
      duration: 90,
      rating: 4,
      rental_price: 2.5,
      price: 8,
      stock: 3,
      description: 'Test'
    }];
    component.selectedMovieId = 'm1';

    component.updatePrice();

    expect(component.selectedPrice).toBe(2.5);
  });

 it('debería llamar a createRental con los datos correctos', () => {
  component.selectedUserId = 'user123';
  component.selectedMovieId = 'movie456';
  component.selectedPrice = 4.99;

  rentalServiceSpy.createRental.and.returnValue(of({} as unknown as Rental));

  component.saveRental();

  expect(rentalServiceSpy.createRental).toHaveBeenCalledWith(jasmine.objectContaining({
  userId: 'user123',
  filmId: 'movie456',
  price: 4.99
  }));

});

it('debería mostrar error si falla la carga de usuarios', () => {
  const consoleSpy = spyOn(console, 'error');

  userServiceSpy.getAllUsers.and.returnValue(throwError(() => new Error('fallo usuarios')));
  movieServiceSpy.getAllMovies.and.returnValue(of([])); // para que no explote por esto

  component.ngOnInit();

  expect(consoleSpy).toHaveBeenCalledWith('Error al obtener usuarios:', jasmine.any(Error));
});


it('debería mostrar error si falla la carga de películas', () => {
  const consoleSpy = spyOn(console, 'error');

  userServiceSpy.getAllUsers.and.returnValue(of([]));
  movieServiceSpy.getAllMovies.and.returnValue(throwError(() => new Error('fallo películas')));

  component.ngOnInit();

  expect(consoleSpy).toHaveBeenCalledWith('Error al obtener películas:', jasmine.any(Error));
});


it('debería mostrar alerta si faltan datos para guardar el alquiler', () => {
  spyOn(window, 'alert');
  component.selectedUserId = '';
  component.selectedMovieId = 'm1';
  component.selectedPrice = 4.99;

  component.saveRental();

  expect(window.alert).toHaveBeenCalledWith('Faltan datos para guardar el alquiler');
});



it('debería mostrar error del backend si status 400 y mensaje', () => {
  spyOn(window, 'alert');

  component.selectedUserId = 'user1';
  component.selectedMovieId = 'm1';
  component.selectedPrice = 4.99;

  rentalServiceSpy.createRental.and.returnValue(
    throwError(() => ({
      status: 400,
      error: { error: 'Alquiler duplicado' }
    }))
  );

  component.saveRental();

  expect(window.alert).toHaveBeenCalledWith('Alquiler duplicado');
});

it('debería mostrar alerta genérica si falla el guardado y no hay mensaje claro', () => {
  spyOn(window, 'alert');

  component.selectedUserId = 'user1';
  component.selectedMovieId = 'm1';
  component.selectedPrice = 4.99;

  rentalServiceSpy.createRental.and.returnValue(
    throwError(() => ({ status: 500, error: {} }))
  );

  component.saveRental();

  expect(window.alert).toHaveBeenCalledWith('Error al guardar el alquiler');
});




});
