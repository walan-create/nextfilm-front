import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';
import { RentalsService} from '../../services/rentals.service';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rental } from '../../interfaces/rental.interface';
import { FilterRentalByTextPipe } from '../../pipes/filter-rental-by-text.pipe';
import { OrderByPipe } from "../../pipes/order-by.pipe";


@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReusableModalComponent, RouterModule, FilterRentalByTextPipe, OrderByPipe],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent {


   orderBy:  keyof Rental = 'userName';
    orderDirection: 'asc' | 'desc' = 'asc';
    // Variable para busqueda activa por texto
    searchText: string = '';
  mostrarEntregados = signal(false);
  selectedRental: Rental | null = null;

  rentals = signal<Rental[]>([]);

  rentalsFiltrados = computed(() =>
    this.rentals().filter(rental =>
      this.mostrarEntregados() ? true : !rental.returnDate
    )
  );

  constructor(private rentalsService: RentalsService, private router: Router) {
    this.rentals = this.rentalsService.rentals;
    this.rentalsService.loadRentals().subscribe(); // carga inicial
  }

  openReturnModal(rental: Rental) {
    this.selectedRental = rental;
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

    returnMovie() {
  console.log('Selected rental:', this.selectedRental);

  if (this.selectedRental) {
    const rentalId = this.selectedRental._id || (this as any).selectedRental.id;

    this.rentalsService.returnRental(rentalId).subscribe({
      next: () => {
        this.selectedRental = null;
      },
      error: (err) => {
        console.error('Error devolviendo la película:', err);
      }
    });
  }
}







returnRentalAsync(id: string, returnDate: string): Promise<Rental> {
  return new Promise((resolve, reject) => {
    this.rentalsService.updateRental(id, { returnDate }).subscribe({
      next: (updatedRental) => resolve(updatedRental),
      error: (err) => reject(err)
    });
  });
}


}
