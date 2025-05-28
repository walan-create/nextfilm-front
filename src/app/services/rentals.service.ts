import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { Router } from '@angular/router';

export interface Rental {
  _id: string;
  userId: string;
  userName: string;
  filmId: string;
  filmName: string;
  price: number;
  bookDate: Date | null;
  rentalDate: Date | null;
  expectedReturnDate: Date | string | null;
  returnDate: Date | string | null;
}


const baseUrl = environment.baseUrl;

const emptyRental: Rental = {
  _id: '',
  userId: '',
  userName: '',
  filmId: '',
  filmName: '',
  price: 0,
  bookDate: new Date(),
  rentalDate: new Date(),
  expectedReturnDate: new Date(),
  returnDate: null,
};


@Injectable({ providedIn: 'root' })
export class RentalsService {
  private http = inject(HttpClient);
  private router = inject(Router);

  rentals = signal<Rental[]>([]);

  getAllRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${baseUrl}/rental/getRentals`).pipe(
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

  getRentalById(id: string): Observable<Rental> {
    const cached = this.rentals().find(r => r._id === id);
    if (cached) return of(cached);

    return this.http.get<Rental>(`${baseUrl}/rental/getRental/${id}`).pipe(

      map((rental) => {
        rental.expectedReturnDate = rental.expectedReturnDate
          ? new Date(rental.expectedReturnDate)
          : null;
        rental.rentalDate = rental.rentalDate ? new Date(rental.rentalDate) : null;
        rental.returnDate = rental.returnDate ? new Date(rental.returnDate) : null;
        rental.bookDate = rental.bookDate ? new Date(rental.bookDate) : null
        return rental;
      }),
      tap((rental) => {
        this.rentals.update(r => [...r, rental]);
      }),

      catchError((error) => {
        console.error('Error fetching rental:', error);
        return of(emptyRental);
      })
    );
  }

  createRental(data: Partial<Rental>): Observable<Rental> {
    return this.http.post<Rental>(`${baseUrl}/rental/newRental`, data).pipe(
      tap((newRental) => {
        this.rentals.update(r => [...r, newRental]);
        alert('Alquiler creado')
        this.router.navigate(['/rentals'])
      }),
      catchError((error) => {
        console.error('Error creating rental:', error);
        alert('Ya existe el alquiler')
        return of(emptyRental);
      })
    );
  }

  updateRental(id: string, data: Partial<Rental>): Observable<Rental> {
    return this.http.put<Rental>(`${baseUrl}/rental/updateRental/${id}`, data).pipe(
      tap((updated) => {
        this.rentals.update(r =>
          r.map(item => item._id === id ? updated : item)
        );
      }),
      catchError((error) => {
        console.error('Error updating rental:', error);
        throw error;
      })
    );
  }



  deleteRental(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/rental/deleteRental/${id}`).pipe(
      tap(() => {
        this.rentals.update(r => r.filter(item => item._id !== id));
        localStorage.setItem('rentals', JSON.stringify(this.rentals()));
      })
    );
  }

  returnRental(id: string): Observable<Rental> {
    return this.http.put<Rental>(`${baseUrl}/rental/returnRental/${id}`, {}).pipe(
      tap((updated) => {
        this.rentals.update(r =>
          r.map(item => item._id === updated._id ? updated : item)
        );
      }),
      catchError((error) => {
        console.error('Error marcando devolución:', error);
        throw error;
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
}
