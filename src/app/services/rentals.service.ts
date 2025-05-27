import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, of, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

export interface Rental {
  id: string;
  userId: string;
  userName: string;
  filmId: string;
  filmName: string;
  price: number;
  bookDate: Date;
  rentalDate: Date;
  expectedReturnDate: Date;
  returnDate: Date | null;
}


const baseUrl = environment.baseUrl;

const emptyRental: Rental = {
  id: '',
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
    const cached = this.rentals().find(r => r.id === id);
    if (cached) return of(cached);

    return this.http.get<Rental>(`${baseUrl}/rental/getRental/${id}`).pipe(
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
    return this.http.patch<Rental>(`${baseUrl}/rental/updateRental/${id}`, data).pipe(
      tap((updated) => {
        this.rentals.update(r =>
          r.map(item => item.id === id ? updated : item)
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
        this.rentals.update(r => r.filter(item => item.id !== id));
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
}
