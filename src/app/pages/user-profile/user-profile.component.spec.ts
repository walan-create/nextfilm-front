import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserProfileComponent } from './user-profile.component';
import { AuthService } from '@auth/services/auth.service';
import { RentalsService } from '../../services/rentals.service';
import { Rental } from '../../interfaces/rental.interface';
import { of, BehaviorSubject } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let rentalsServiceSpy: jasmine.SpyObj<RentalsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockRentals: Rental[] = [
    {
      _id: '1',
      userId: 'u1',
      filmId: 'f1',
      userName: 'Test User',
      filmName: 'Test Movie',
      price: 5.5,
      bookDate: new Date(),
      rentalDate: new Date(),
      expectedReturnDate: new Date(Date.now() + 2 * 86400000), // 2 días más
      returnDate: null,
    },
  ];

  beforeEach(async () => {
    // Creas tus spies antes de configurar el módulo
    rentalsServiceSpy = jasmine.createSpyObj('RentalsService', ['userRentals', 'loadUserRentals']);
    rentalsServiceSpy.userRentals.and.returnValue(mockRentals);
    rentalsServiceSpy.loadUserRentals.and.stub(); // espía activo

    authServiceSpy = jasmine.createSpyObj('AuthService', ['user']);
    (authServiceSpy.user as jasmine.Spy).and.returnValue({ id: 'u1', name: 'Test User' });

    await TestBed.configureTestingModule({
      imports: [
        UserProfileComponent,
        RouterTestingModule.withRoutes([]),  // <-- importa el módulo de router de testing
      ],
      providers: [
        { provide: RentalsService, useValue: rentalsServiceSpy },
        { provide: AuthService,    useValue: authServiceSpy    },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if rental is late and not returned', () => {
    const lateRental: Rental = {
      ...mockRentals[0],
      expectedReturnDate: new Date(Date.now() - 86400000), // ayer
      returnDate: null,
    };
    expect(component.isLateReturn(lateRental)).toBeTrue();
  });

  it('should return false if rental is already returned', () => {
    const returnedRental: Rental = {
      ...mockRentals[0],
      returnDate: new Date(),
    };
    expect(component.isLateReturn(returnedRental)).toBeFalse();
  });

  it('should return number of days left if rental is active', () => {
    const daysLeft = component.getDaysLeft(mockRentals[0]);
    expect(typeof daysLeft).toBe('number');
    expect(daysLeft).toBeGreaterThan(0);
  });

  it('should return null if rentalDate or expectedReturnDate is null', () => {
    const rental: Rental = {
      ...mockRentals[0],
      rentalDate: null,
      expectedReturnDate: null,
    };
    expect(component.getDaysLeft(rental)).toBeNull();
  });

  it('should expose rentals from service correctly', () => {
    expect(component.rentals()).toEqual(mockRentals);
  });

  it('should call moviesResource.reload if user exists after view init', () => {
    // Simula cambio de user de null a algo para disparar tu timeout interno
    const userSpy = jasmine.createSpy().and.returnValues(null, { id: 'u1', name: 'Test User' });
    (component.authService as any).user = userSpy;

    spyOn(component.moviesResource, 'reload');
    spyOn(window, 'setTimeout').and.callFake(((handler: TimerHandler, timeout?: number, ...args: any[]) => {
      if (typeof handler === 'function') { handler(...args); }
      return 0;
    }) as unknown as typeof window.setTimeout);

    component.ngAfterViewInit();
    expect(component.moviesResource.reload).toHaveBeenCalled();
  });

  it('debería llamar a rentalsService.loadUserRentals cuando se recarga moviesResource', async () => {
    rentalsServiceSpy.loadUserRentals.and.returnValue(of(mockRentals));

    fixture.detectChanges();      // dispara ngOnInit y tus señales si lo necesita
    component.moviesResource.reload();

    await fixture.whenStable();   // espera a que terminen los microtasks
    expect(rentalsServiceSpy.loadUserRentals).toHaveBeenCalled();

    const result = component.moviesResource.value();
    expect(result).toEqual(mockRentals);
  });
});
