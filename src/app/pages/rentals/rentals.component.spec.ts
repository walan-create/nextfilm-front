import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalsComponent } from './rentals.component';
import { RentalsService } from '../../services/rentals.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

describe('RentalsComponent test', () => {
  let fixture: ComponentFixture<RentalsComponent>;
  let component: RentalsComponent;

  //Mock de RentalService para no tener que llamar
  const mockRentalsService = {
    rentals: signal([]),
    loadRentals: () => of([]),
    returnRental: () => of({}),
    updateRental: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RentalsComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: RentalsService, useValue: mockRentalsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //Should create RentalsComponent
  it('should instantiate the component', () => {
    expect(component).toBeDefined();
  });

  //Filtrar rentals para ver los que estan ya entregados o no
  it('should correctly filter rentals depending on mostrarEntregados flag', () => {
    //mock de la lista de rentals con lo necesario para que funcione mostrarEntregados
    const mockData:any[] = [
      { returnDate: null },
      { returnDate: new Date() },
      {returnDate: null}
    ];

    component.rentals.set(mockData);

    // Caso cuando se muestran todos los datos(true)
    component.mostrarEntregados.set(true);
    const allRentals = component.rentalsFiltrados();
    expect(allRentals.length).toEqual(3);

    // Caso cuando solo devuelven los no entregados (false)
    component.mostrarEntregados.set(false);
    const pendingOnly = component.rentalsFiltrados();
    expect(pendingOnly.length).toEqual(2);
  });



  // test para openReturnModal
it('debería guardar el rental seleccionado y abrir el modal si existe', () => {
  const MockRental = { _id: 'test1234' } as any;

  const showMock = jasmine.createSpy('show');

  // Simulamos bootstrap.Modal porque si no peta
  (window as any).bootstrap = {
    Modal: function () {
      return { show: showMock };
    }
  };

  // fake del modal del DOM
  const modalSimulado = {} as any;

  spyOn(document, 'getElementById').and.returnValue(modalSimulado);

  component.openReturnModal(MockRental);

  expect(component.selectedRental).toEqual(MockRental);
  expect(document.getElementById).toHaveBeenCalledWith('reusableModal');
  expect(showMock).toHaveBeenCalled(); // es llamado la funcion
});

//Test para ReturnMovie
it('debería retornar la película seleccionada por id y manejar errores', () => {
  const mockRental = { _id: 'test1234' } as any;
  const errorMock = new Error('Fallo de red');
  component.selectedRental = mockRental;

  const returnRentalSpy = spyOn((component as any).rentalsService, 'returnRental')
    .and.returnValue(of({}));

  component.returnMovie();

  expect(returnRentalSpy).toHaveBeenCalledWith('test1234');
  expect(component.selectedRental).toBeNull();

  // Simular error
  (component as any).rentalsService.returnRental.and.returnValue(throwError(() => errorMock));
  spyOn(console, 'error');
  component.selectedRental = mockRental;

  component.returnMovie();

  expect(console.error).toHaveBeenCalledWith(
    'Error devolviendo la película:', errorMock
  );
});



//Test returnRentalAsync
it('debería resolver el rental actualizado y manejar error correctamente', async () => {
  const mockId = 'test1234';
  const mockDate = '2025-06-05';
  const mockUpdatedRental = { _id: mockId, returnDate: mockDate } as any;
  const errorMock = new Error('Fallo de red');

  // Éxito
  const serviceSpy = spyOn((component as any).rentalsService, 'updateRental')
    .and.returnValue(of(mockUpdatedRental));

  const result = await component.returnRentalAsync(mockId, mockDate);

  expect(serviceSpy).toHaveBeenCalledWith(mockId, { returnDate: mockDate });
  expect(result).toEqual(mockUpdatedRental);

  // Error
  serviceSpy.and.returnValue(throwError(() => errorMock));

  try {
    await component.returnRentalAsync(mockId, mockDate);
    fail('La promesa debería haber sido rechazada');
  } catch (error) {
    expect(error).toBe(errorMock);
  }
});







});
