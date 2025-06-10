import { AuthService } from '@auth/services/auth.service';
import { Rental } from './../interfaces/rental.interface';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"
import { RentalsService } from "./rentals.service"
import { environment } from "../../environments/environment"
import { provideHttpClient } from "@angular/common/http"
import { computed, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core"
import { TestBed } from "@angular/core/testing"
import { provideRouter } from "@angular/router"
import { User } from '@auth/interfaces/user.interface';
import { of } from 'rxjs';

const baseUrl = environment.baseUrl

const mockUser: User = {
    _id: '5',
    email: 'antonio@email.com',
    name: 'Antonio',
    isAdmin: false,
}

class AuthServiceMock{
    user = signal<User| null>(null)
}

const emptyRental: Rental = {
  _id: '',
  userId: '',
  filmId: '',
  userName: '',
  filmName: '',
  price: 0,
  bookDate: new Date(),
  rentalDate: null,
  expectedReturnDate: null,
  returnDate: null,
};

const rentalMock: Rental[] = [
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
  },

{
    _id: '4',
    userId: '5',
    filmId: '6',
    userName: 'Antonio',
    filmName: 'Prueba',
    price: 15,
    bookDate: new Date('2020-01-01'),
    rentalDate: new Date('2020-01-01'), // formato ISO (YYYY-MM-DD)
    expectedReturnDate: new Date('2021-02-02'), // formato ISO (YYYY-MM-DD)
    returnDate: new Date('2022-03-03'), // formato ISO (YYYY-MM-DD)
  },

{
    _id: '7',
    userId: '8',
    filmId: '9',
    userName: 'Laura',
    filmName: 'Aventura Total',
    price: 12,
    bookDate: new Date('2023-01-15'),
    rentalDate: new Date('2023-01-16'),
    expectedReturnDate: new Date('2023-01-23'),
    returnDate: null,
  },
{
    _id: '10',
    userId: '11',
    filmId: '12',
    userName: 'Carlos',
    filmName: 'Comedia Loca',
    price: 8,
    bookDate: null,
    rentalDate: new Date('2022-05-10'),
    expectedReturnDate: new Date('2022-05-17'),
    returnDate: new Date('2022-05-16'),
  },
{
    _id: '13',
    userId: '14',
    filmId: '15',
    userName: 'Ana',
    filmName: 'Drama Profundo',
    price: 20,
    bookDate: new Date('2024-03-01'),
    rentalDate: null,
    expectedReturnDate: null,
    returnDate: null,
  }
]

describe('RentalsService', () => {
    let service: RentalsService
    let httpMock: HttpTestingController
    let authService: AuthServiceMock

    let storage: { [key: string]: string } = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [],
          providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            provideRouter([]),
            RentalsService,
            {provide: AuthService, useClass: AuthServiceMock}
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        service = TestBed.inject(RentalsService)
        httpMock = TestBed.inject(HttpTestingController)
        authService = TestBed.inject(AuthService) as unknown as AuthServiceMock

        storage = {}
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

    describe('getAllRentals', () => {
        it('should return all rentals', () => {
            service.getAllRentals().subscribe((rentals) => {
                expect(rentals.length).toBe(5)
                expect(rentals).toBe(rentalMock)
            })
            const req = httpMock.expectOne(`${baseUrl}/rental/getRentals`);
            expect(req.request.method).toBe('GET');
            req.flush(rentalMock);

            expect(service.rentals()).toBe(rentalMock);
            expect(localStorage.setItem).toHaveBeenCalledWith(
              'rentals',
              JSON.stringify(rentalMock)
            );
        })

        it('should return an empty array if an error occurs', () => {
            service.getAllRentals().subscribe((rentals) => {
                expect(rentals.length).toBe(0)
            })
            const req = httpMock.expectOne(`${baseUrl}/rental/getRentals`);
            expect(req.request.method).toBe('GET');
            req.flush('Error loading rentals:', {
                status: 500,
                statusText: 'Internal Server Error'
            });
            expect(service.rentals()).toEqual([])
        })
    })

    describe('getRentalsByUserId', () => {
        it('should return all rentals from an user', (done) => {
            const userId = mockUser._id
            authService.user.set(mockUser)
              service.getRentalsByUserId().subscribe((rentals) => {
                expect(rentals.length).toBe(1);
                expect(rentals[0]._id).toBe('4');
                expect(rentals[0].filmName).toBe('Prueba');
                done();
            });

            const req = httpMock.expectOne(`${baseUrl}/rental/getRentalsByUser/${userId}`);
            expect(req.request.method).toBe('GET');
            req.flush([rentalMock[1]]);
            expect(service.userRentals()).toContain(rentalMock[1])
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'userRentals',
                JSON.stringify([rentalMock[1]])
            )
        })

        it('should return all rentals from an user with null dates if there are not sent in petition', (done) => {
            authService.user.set({_id: '2', email: 'pepe@email.com', name: 'Pepe', isAdmin: false,})
            const userId = authService.user()?._id
              service.getRentalsByUserId().subscribe((rentals) => {
                expect(rentals.length).toBe(1);
                expect(rentals[0]._id).toBe('1');
                expect(rentals[0].filmName).toBe('Ejemplo');
                expect(rentals[0].expectedReturnDate).toBeNull()
                expect(rentals[0].returnDate).toBeNull()
                expect(rentals[0].rentalDate).toBeNull()
                done();
            });

            const req = httpMock.expectOne(`${baseUrl}/rental/getRentalsByUser/${userId}`);
            expect(req.request.method).toBe('GET');
            req.flush([rentalMock[0]]);
            expect(service.userRentals()).toContain(rentalMock[0])
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'userRentals',
                JSON.stringify([rentalMock[0]])
            )
        })
        it('should return an empty array when there is no userId', () => {
            authService.user.set(null)
            service.getRentalsByUserId().subscribe((rentals) => {
                expect(rentals).toEqual([]);
            });

            httpMock.expectNone(`${baseUrl}/rental/getRentalsByUser/${authService.user()?._id}`)

        })

        it('should throw an error when there is a problem creating the book and return an empty array', () => {
            authService.user.set({_id: '23', email: 'rgr', name: 'regre', isAdmin: false})
            service.getRentalsByUserId().subscribe({
                next: (rental) => expect(rental).toEqual([]),
                error: () => fail('Expected an error, not rentals')
            });

            const req = httpMock.expectOne(`${baseUrl}/rental/getRentalsByUser/${authService.user()?._id}`);
            expect(req.request.method).toBe('GET');
            req.flush('Rental not found:', {
                status: 400,
                statusText: 'Bad Request'
            })
        })
    })

    describe('getRentalById', () => {
        it('should return a rental by ID', () => {
            const rentalId = '1'
            service.getRentalById(rentalId).subscribe((rental) => {
                expect(rental).toEqual(rentalMock[0])
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/getRental/${rentalId}`);
            expect(req.request.method).toBe('GET');
            req.flush(rentalMock[0]);

            expect(service.rentals()).toContain(rentalMock[0])
        })

        it('should contain dates if dates are provided in the rental', () => {
            const rentalId = '4'
            service.getRentalById(rentalId).subscribe((rental) => {
                expect(rental).toEqual(rentalMock[1])
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/getRental/${rentalId}`);
            expect(req.request.method).toBe('GET');
            req.flush(rentalMock[1]);

            expect(service.rentals()).toContain(rentalMock[1])
        
        })

        it('should not send a request when rental is in cache', () => {
            service.rentals.set(rentalMock)
            const rentalId = '7'
            service.getRentalById(rentalId).subscribe((rental) => {
                expect(rental).toEqual(rentalMock[2])
            })

            httpMock.expectNone(`${baseUrl}/rental/getRental/${rentalId}`);

        })

        it('should return an empty rental if it is not found', () => {
            const rentalId = '45'
            service.getRentalById(rentalId).subscribe({
                next: (rental) => expect(rental).toEqual(emptyRental),
                error: () => fail('Expected an error, not rentals')
            });

            const req = httpMock.expectOne(`${baseUrl}/rental/getRental/${rentalId}`);
            expect(req.request.method).toBe('GET');
            req.flush('Rental not found:', {
                status: 400,
                statusText: 'Bad Request'
            })
        })
    })

    describe('createRental', () => {
        it('should create the rental', () => {
            const newRental: Partial<Rental> = {
                _id: '16',
                userId: '17',
                filmId: '18',
                userName: 'María',
                filmName: 'El Misterio del Bosque',
                price: 18,
                bookDate: new Date('2025-05-10'),
                rentalDate: new Date('2025-05-12'),
                expectedReturnDate: new Date('2025-05-19'),
                returnDate: null,
            };

            service.createRental(newRental).subscribe((rental) => {
                expect(rental).toEqual({...newRental} as Rental)
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/newRental`);
            expect(req.request.method).toBe('POST')
            req.flush({...newRental})

            expect(service.rentals()).toContain({...newRental} as Rental)

        })

        it('should return an empty rental when there is an error on createRental', () => {
            const newRental: Partial<Rental> = {
                userName: 'María'
            }
            service.createRental(newRental).subscribe({
                next: (rental) => expect(rental).toEqual(emptyRental),
                error: () => fail('Expected an error, not rental')
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/newRental`);
            expect(req.request.method).toBe('POST')
            req.flush('Error creating rental: ', {
                status: 400,
                statusText: 'Bad Request'
            })
        })
    })

    describe('updateRental', () => {
        it('should update an existing rental', () => {
            const id = '1';
            const updatedRental: Partial<Rental> = {
                userId: '2',
                filmId: '3',
                userName: 'Pepe',
                filmName: 'Ejemplo',
                price: 50,
                bookDate: new Date(),
                rentalDate: null, // formato ISO (YYYY-MM-DD)
                expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
                returnDate: null, // formato ISO (YYYY-MM-DD)
            }

            service.rentals.set(rentalMock)

            service.updateRental(id, updatedRental).subscribe((rental) => {
                expect(rental).toEqual({...updatedRental, _id: id} as Rental);
            });

            const req = httpMock.expectOne(`${baseUrl}/rental/updateRental/${id}`);
            expect(req.request.method).toBe('PUT');
            req.flush({...updatedRental, _id:id});

            expect(service.rentals()).toContain({
                ...updatedRental,
                _id:id
            } as Rental)
        })

        it('should return an empty rental when error on updateRental', () => {
            const id = '564'
            const updatedRental: Partial<Rental> = {
                price: 50,
            }
            service.updateRental(id, updatedRental).subscribe({
                next: () => fail('Expected error, not success'),
                error: (error) => {expect(error).toBeTruthy()}
            });
            
            const req = httpMock.expectOne(`${baseUrl}/rental/updateRental/${id}`);
            expect(req.request.method).toBe('PUT');
            req.flush('Error updating rental', {
                status: 400,
                statusText: 'Bad Request'
            })
        })
    })

    describe('deleteRental', () => {
        it('should delete a rental by ID', () => {
            const id = '1'
            service.rentals.set(rentalMock)

            service.deleteRental(id).subscribe((response) => {
                expect(response).toBeTruthy()
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/deleteRental/${id}`);
            expect(req.request.method).toBe('DELETE');
            req.flush({success: true})

            expect(service.rentals).not.toContain(rentalMock[0])
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'rentals',
                JSON.stringify([rentalMock[1], rentalMock[2], rentalMock[3], rentalMock[4]])
            )
        })
    })

    describe('returnRental', () => {
        it('should return the rental adding a rentalDate', () => {
            const id = '1'
            const returnedRental: Partial<Rental> = {
                userId: '2',
                filmId: '3',
                userName: 'Pepe',
                filmName: 'Ejemplo',
                price: 50,
                bookDate: new Date(),
                rentalDate: null, // formato ISO (YYYY-MM-DD)
                expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
                returnDate: new Date(), // formato ISO (YYYY-MM-DD)
            }
            service.rentals.set(rentalMock)

            service.returnRental(id).subscribe((updated) => {
                expect(updated).toEqual({...returnedRental, _id:id} as Rental)
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/returnRental/${id}`)
            expect(req.request.method).toBe('PUT')
            req.flush({...returnedRental, _id:id});

            expect(service.rentals()).toContain({
                ...returnedRental,
                _id:id
            } as Rental)
        })

        it('throws an error when there is an error returning the rental', () => {
            const id = '564'
            const updatedRental: Partial<Rental> = {
                price: 50,
            }
            service.returnRental(id).subscribe({
                next: () => fail('Expected error, not success'),
                error: (error) => {expect(error).toBeTruthy()}
            });
            
            const req = httpMock.expectOne(`${baseUrl}/rental/returnRental/${id}`);
            expect(req.request.method).toBe('PUT');
            req.flush('Error updating rental', {
                status: 400,
                statusText: 'Bad Request'
            })
        
        })
    })

    describe('getLocalRentals', () => {
        it('should return rentals from local storage', () => {
            storage = { rentals: JSON.stringify(rentalMock) };

            const rentals = service.getLocalRentals();
            expect(rentals.length).toBe(5);


        });

        it('should return an empty array if no rentals in local storage', () => {
            const rentals = service.getLocalRentals();
            expect(rentals.length).toBe(0);
        });
    })

    describe('loadRentals', () => {
        it('should return all rentals in database', () => {
            service.loadRentals().subscribe((rentals) => {
                expect(rentals.length).toBe(5)
                expect(rentals).toBe(rentalMock)
            })
            const req = httpMock.expectOne(`${baseUrl}/rental/getRentals`);
            expect(req.request.method).toBe('GET');
            req.flush(rentalMock);
        })
    });

    describe('getUserLocalRentals', () => {
        it('should get the user rentals from local storage', () => {
            storage = { userRentals: JSON.stringify([rentalMock[0]]) };

            const rentals = service.getUserLocalRentals();
            expect(rentals.length).toBe(1);

        });

        it('should return an empty array if no rentals in local storage', () => {
            const rentals = service.getUserLocalRentals();
            expect(rentals.length).toBe(0);
        });
    })

    describe('loadUserRentals', () => {
        it('should call the getRentalsByUserId method', () => {
            const spy = spyOn(service, 'getRentalsByUserId').and.returnValue(of([rentalMock[0]]));

            service.loadUserRentals().subscribe((rentals) => {
                expect(spy).toHaveBeenCalled();
                expect(rentals.length).toBe(1)
            })

        })
    })

    describe('createBook', () => {
        it('should create a new book', () => {
            const newBook: Partial<Rental> = {
                _id: '16',
                userId: '17',
                filmId: '3',
                userName: 'María',
                filmName: 'El Misterio del Bosque',
                price: 18,
                bookDate: new Date('2025-05-10'),
                rentalDate: new Date('2025-05-12'),
                expectedReturnDate: new Date('2025-05-19'),
                returnDate: null,
            };
            const filmId = '3'

            service.createBook(filmId).subscribe((book) => {
                expect(book).toEqual({...newBook} as Rental)
            })

            const req = httpMock.expectOne(`${baseUrl}/rental/newBook/${filmId}`);
            expect(req.request.method).toBe('POST')
            req.flush({...newBook})

            expect(service.rentals()).toContain({...newBook} as Rental)

        })
    })
  
}) 