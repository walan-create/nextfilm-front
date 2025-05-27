import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { Rental } from '../interfaces/rental.interface';
import { AuthService } from '@auth/services/auth.service';

const baseUrl = environment.baseUrl;

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

@Injectable({ providedIn: 'root' })
export class RentalsService {
  private http = inject(HttpClient);
  authService = inject(AuthService);

  rentals = signal<Rental[]>([]);
  userRentals = signal<Rental[]>([]); // Rentals del user en sesión

  getAllRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${baseUrl}/getRentals`).pipe(
      tap((rentals) => {
        this.rentals.set(rentals);
        localStorage.setItem('rentals', JSON.stringify(rentals));
      }),
      catchError((error) => {
        console.error('Error loading rentals:', error);
        return of([]);
      })
    );
  }

  getRentalsByUserId(): Observable<Rental[]> {
    // Obtenemos el id por el service de sesión
    const userId = this.authService.user()?._id;

    return this.http
      .get<Rental[]>(`${baseUrl}/rental/getRentalsByUser/${userId}`)
      .pipe(
        tap((rentals) => console.log('User Rentals:', rentals)),
        map((rentals) =>
          rentals.map((rental) => ({
            ...rental,
            expectedReturnDate: rental.expectedReturnDate
              ? new Date(rental.expectedReturnDate)
              : null,
            rentalDate: rental.rentalDate ? new Date(rental.rentalDate) : null,
            returnDate: rental.returnDate ? new Date(rental.returnDate) : null,
            bookDate: new Date(rental.bookDate),
          }))
        ),
        tap((rentals) => {
          this.userRentals.set(rentals);
          localStorage.setItem('userRentals', JSON.stringify(rentals));
        }),
        catchError((error) => {
          console.error('Error loading rentals:', error);
          return of([]);
        })
      );
  }

  getRentalById(id: string): Observable<Rental> {
    const cached = this.rentals().find((r) => r._id === id);
    if (cached) return of(cached);

    return this.http.get<Rental>(`${baseUrl}/getRental/${id}`).pipe(
      tap((rental) => {
        this.rentals.update((r) => [...r, rental]);
      }),
      catchError((error) => {
        console.error('Error fetching rental:', error);
        return of(emptyRental);
      })
    );
  }

  createRental(data: Partial<Rental>): Observable<Rental> {
    return this.http.post<Rental>(`${baseUrl}/newRental`, data).pipe(
      tap((newRental) => {
        this.rentals.update((r) => [...r, newRental]);
      }),
      catchError((error) => {
        console.error('Error creating rental:', error);
        return of(emptyRental);
      })
    );
  }

  updateRental(id: string, data: Partial<Rental>): Observable<Rental> {
    return this.http.patch<Rental>(`${baseUrl}/updateRental/${id}`, data).pipe(
      tap((updated) => {
        this.rentals.update((r) =>
          r.map((item) => (item._id === id ? updated : item))
        );
      }),
      catchError((error) => {
        console.error('Error updating rental:', error);
        throw error;
      })
    );
  }

  deleteRental(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/deleteRental/${id}`).pipe(
      tap(() => {
        this.rentals.update((r) => r.filter((item) => item._id !== id));
        localStorage.setItem('rentals', JSON.stringify(this.rentals()));
      })
    );
  }

  getLocalRentals(): Rental[] {
    const data = localStorage.getItem('rentals');
    return data ? JSON.parse(data) : [];
  }

  loadRentals(): Observable<Rental[]> {
    return this.getAllRentals();
  }

  getUserLocalRentals(): Rental[] {
    const data = localStorage.getItem('userRentals');
    return data ? JSON.parse(data) : [];
  }

  loadUserRentals(): Observable<Rental[]> {
    return this.getRentalsByUserId();
  }

  createBook(filmId: string): Observable<Rental> {
    return this.http.post<Rental>(`${baseUrl}/rental/newBook/${filmId}`, {});
  }
}
