import {
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

    while(!this.authService.user()) { // espera a que coja los datos del usuario
      setTimeout(() => {
        this.moviesResource.reload();
      }, 300);
    }


  }

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
