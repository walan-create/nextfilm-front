import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Rental } from '../../interfaces/rental.interface';
import { RentalsService } from '../../services/rentals.service';
import { AuthService } from '@auth/services/auth.service';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalFilterByTextPipe } from '../../pipes/rental-filter-by-text.pipe';
import { MoviesService } from '../../services/movies.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile',
  imports: [
    OrderByPipe,
    RentalFilterByTextPipe,
    RouterLink,
    NgClass,
    FormsModule,
  ],
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent  {
  // rentalsMock: Rental[] = [
  //   {
  //     id: '1a2b3c4d5e',
  //     userId: 'user001',
  //     filmId: 'film001',
  //     userName: 'Juan Pérez',
  //     filmName: 'Matrix',
  //     price: 3.99,
  //     bookDate: new Date('2025-05-23T08:00:00.000Z'),
  //     rentalDate: new Date('2025-05-24T10:00:00.000Z'),
  //     expectedReturnDate: new Date('2025-05-27T10:00:00.000Z'),
  //     returnDate: new Date('2025-05-27T09:36:56.868Z'),
  //   },
  //   {
  //     id: '2b3c4d5e6f',
  //     userId: 'user002',
  //     filmId: 'film002',
  //     userName: 'Ana Gómez',
  //     filmName: 'Inception',
  //     price: 4.5,
  //     bookDate: new Date('2025-05-24T09:00:00.000Z'),
  //     rentalDate: new Date('2025-05-24T09:36:56.868Z'),
  //     expectedReturnDate: new Date('2025-05-27T09:36:56.868Z'),
  //     returnDate: new Date('2025-05-28T09:36:56.868Z'), // Devolución con atraso
  //   },
  //   {
  //     id: '3c4d5e6f7g',
  //     userId: 'user003',
  //     filmId: 'film003',
  //     userName: 'Luis Martínez',
  //     filmName: 'Interstellar',
  //     price: 5.0,
  //     bookDate: new Date('2025-05-25T07:30:00.000Z'),
  //     rentalDate: null,
  //     expectedReturnDate: null,
  //     returnDate: null,
  //   },
  //   {
  //     id: '4d5e6f7g8h',
  //     userId: 'user004',
  //     filmId: 'film004',
  //     userName: 'María López',
  //     filmName: 'Avatar',
  //     price: 3.5,
  //     bookDate: new Date('2025-05-26T09:00:00.000Z'),
  //     rentalDate: null,
  //     expectedReturnDate: null,
  //     returnDate: null,
  //   },
  //   {
  //     id: '434e6f7g8h',
  //     userId: 'user004',
  //     filmId: 'film004',
  //     userName: 'María López',
  //     filmName: 'Armaggedon',
  //     price: 3.5,
  //     bookDate: new Date('2025-05-26T09:00:00.000Z'),
  //     rentalDate: new Date('2025-05-24T09:36:56.868Z'),
  //     expectedReturnDate: new Date('2025-05-26T09:36:56.868Z'),
  //     returnDate: null,
  //   },
  //   {
  //     id: '434e6f7g8h',
  //     userId: 'user004',
  //     filmId: 'film004',
  //     userName: 'María López',
  //     filmName: 'Iron Fist',
  //     price: 3.5,
  //     bookDate: new Date('2025-05-23T09:00:00.000Z'),
  //     rentalDate: new Date('2025-05-24T09:36:56.868Z'),
  //     expectedReturnDate: new Date('2025-05-29T09:36:56.868Z'),
  //     returnDate: null,
  //   },
  // ];

  authService = inject(AuthService);
  rentalsService = inject(RentalsService);

  rentals = computed(() => this.rentalsService.userRentals());

  // Variables para ordenación
  orderBy: keyof Rental = 'filmName';
  orderDirection: 'asc' | 'desc' = 'asc';
  // Variable para busqueda activa por texto
  searchText: string = '';

  ngAfterViewInit() {
    // Cargar las peliculas al iniciar el componente

    if(!this.authService.user()) {
      setTimeout(() => {
        this.moviesResource.reload();
      }, 300); 
    }


  }

  // loadRentals() {
  //   this.rentalsService.loadUserRentals().subscribe({
  //     next: (rentals) => {
  //       // Actualizar el signal con las peliculas obtenidas
  //       this.rentalsService.userRentals.set(rentals);
  //     },
  //     error: (err) => {
  //       console.error('Error loading movies:', err);
  //     },
  //   });
  // }


  moviesResource = rxResource({
    loader: () => this.rentalsService.loadUserRentals(),
  });

  isLateReturn(rental: Rental): boolean {
    // Si no hay fecha de devolución y la fecha esperada de devolución ya pasó, está atrasada
    if (!rental.returnDate && rental.expectedReturnDate) {
      const today = new Date();
      // Compara solo la parte de la fecha, ignorando la hora
      return today.getTime() > rental.expectedReturnDate.getTime();
    }
    return false;
  }

  getDaysLeft(rental: Rental): number | null {
    if (rental.rentalDate && rental.expectedReturnDate) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const diff = rental.expectedReturnDate.getTime() - new Date().getTime();
      return Math.ceil(diff / msPerDay);
    }
    return null;
  }
}
