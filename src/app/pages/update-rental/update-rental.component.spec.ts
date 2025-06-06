import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateRentalComponent } from './update-rental.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalsService } from '../../services/rentals.service';
import { ServiceNameServices } from '../../services/user.service';
import { MoviesService } from '../../services/movies.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Rental } from '../../interfaces/rental.interface';

describe('UpdateRentalComponent', () => {
  let component: UpdateRentalComponent;
  let fixture: ComponentFixture<UpdateRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRentalComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'r1' } } } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }, // ✅ Esto sí lo es
        { provide: RentalsService, useValue: jasmine.createSpyObj('RentalsService', ['getRentalById', 'updateRental']) },
        { provide: ServiceNameServices, useValue: jasmine.createSpyObj('ServiceNameServices', ['getAllUsers']) },
        { provide: MoviesService, useValue: jasmine.createSpyObj('MoviesService', ['getAllMovies']) },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => { } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRentalComponent);
    component = fixture.componentInstance;

    // mocks de retorno para evitar errores al llamar a subscribe() en ngOnInit
    const rentalService = TestBed.inject(RentalsService) as jasmine.SpyObj<RentalsService>;
    rentalService.getRentalById.and.returnValue(of({
      userId: 'u1',
      filmId: 'm1',
      price: 3.99,
      expectedReturnDate: new Date()
    } as unknown as Rental));


    const userService = TestBed.inject(ServiceNameServices) as jasmine.SpyObj<ServiceNameServices>;
    userService.getAllUsers.and.returnValue(of([]));

    const movieService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
    movieService.getAllMovies.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });






  it('debería actualizar el precio si encuentra la película', () => {
    component.movies = [{ _id: 'm1', rental_price: 3.99 } as any];
    component.selectedMovieId = 'm1';

    component.updatePrice();

    expect(component.selectedPrice).toBe(3.99);
  });

  it('debería poner el precio a 0 si no encuentra la película', () => {
    component.movies = [{ _id: 'm2', rental_price: 5.00 } as any]; // no coincide
    component.selectedMovieId = 'm1';

    component.updatePrice();

    expect(component.selectedPrice).toBe(0);
  });



  it('debería actualizar expectedReturnDate al cambiar la fecha', () => {
    const mockEvent = {
      target: { value: '2025-07-01' }
    } as unknown as Event;

    component.onDateChange(mockEvent);

    expect(component.expectedReturnDate).toBe('2025-07-01');
  });


  it('debería mostrar alerta si faltan datos para actualizar el alquiler', () => {
    spyOn(window, 'alert');

    component.selectedUserId = '';
    component.selectedMovieId = '';
    component.selectedPrice = 0;

    component.updateRental();

    expect(window.alert).toHaveBeenCalledWith('Faltan datos para actualizar el alquiler');
  });



  it('debería mostrar alerta y navegar si updateRental tiene éxito', () => {
    spyOn(window, 'alert');
    const rentalService = TestBed.inject(RentalsService) as jasmine.SpyObj<RentalsService>;
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>;  // <= AQUI

    rentalService.updateRental.and.returnValue(of({} as unknown as Rental)); // <= o aquí

    component.rentalId = 'r1';
    component.selectedUserId = 'u1';
    component.selectedMovieId = 'm1';
    component.selectedPrice = 4.99;
    component.expectedReturnDate = '2025-07-01';

    component.updateRental();

    expect(window.alert).toHaveBeenCalledWith('Alquiler actualizado correctamente');
    expect(router.navigate).toHaveBeenCalledWith(['/rentals']);  // <= ESTA LÍNEA FALLA (119)
  });


  it('debería mostrar alerta si updateRental devuelve error', () => {
    spyOn(window, 'alert');
    const rentalService = TestBed.inject(RentalsService) as jasmine.SpyObj<RentalsService>;
    rentalService.updateRental.and.returnValue(throwError(() => new Error('conflicto')));

    component.rentalId = 'r1';
    component.selectedUserId = 'u1';
    component.selectedMovieId = 'm1';
    component.selectedPrice = 4.99;
    component.expectedReturnDate = '2025-07-01';

    component.updateRental();

    expect(window.alert).toHaveBeenCalledWith('Película ya reservada a ese cliente');
  });

});
