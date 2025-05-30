import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';
import { RentalsService } from '../../services/rentals.service';
import { Router, RouterModule } from '@angular/router';
import { Rental } from '../../interfaces/rental.interface';
import { FilterRentalByTextPipe } from '../../pipes/filter-rental-by-text.pipe';
import { OrderByPipe } from '../../pipes/order-by.pipe';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReusableModalComponent,
    RouterModule,
    FilterRentalByTextPipe,
    OrderByPipe,
  ],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
})
export class RentalsComponent {

//   testRentals: Rental[] = [
//   {
//     _id: 'r1',
//     userId: 'u1',
//     filmId: 'f1',
//     userName: 'Juan Pérez',
//     filmName: 'The Godfather',
//     price: 20,
//     bookDate: new Date('2024-05-01'),
//     rentalDate: new Date('2024-05-02'),
//     expectedReturnDate: new Date('2024-05-09'),
//     returnDate: null,
//   },
//   {
//     _id: 'r2',
//     userId: 'u2',
//     filmId: 'f2',
//     userName: 'Ana García',
//     filmName: 'Inception',
//     price: 18,
//     bookDate: new Date('2024-05-03'),
//     rentalDate: new Date('2024-05-04'),
//     expectedReturnDate: new Date('2024-05-11'),
//     returnDate: new Date('2024-05-10'),
//   },
//   {
//     _id: 'r3',
//     userId: 'u3',
//     filmId: 'f3',
//     userName: 'Carlos López',
//     filmName: 'Avengers: Endgame',
//     price: 22,
//     bookDate: new Date('2024-05-05'),
//     rentalDate: new Date('2024-05-06'),
//     expectedReturnDate: new Date('2024-05-13'),
//     returnDate: null,
//   },
//   {
//     _id: 'r4',
//     userId: 'u4',
//     filmId: 'f4',
//     userName: 'Lucía Fernández',
//     filmName: 'The Hangover',
//     price: 15,
//     bookDate: new Date('2024-05-07'),
//     rentalDate: new Date('2024-05-08'),
//     expectedReturnDate: new Date('2024-05-15'),
//     returnDate: null,
//   },
//   {
//     _id: 'r5',
//     userId: 'u5',
//     filmId: 'f5',
//     userName: 'Miguel Torres',
//     filmName: 'Friday the 13th',
//     price: 17,
//     bookDate: new Date('2024-05-09'),
//     rentalDate: new Date('2024-05-10'),
//     expectedReturnDate: new Date('2024-05-17'),
//     returnDate: new Date('2024-05-16'),
//   },
//   {
//     _id: 'r6',
//     userId: 'u6',
//     filmId: 'f6',
//     userName: 'Sofía Martínez',
//     filmName: 'The Lion King',
//     price: 16,
//     bookDate: new Date('2024-05-11'),
//     rentalDate: new Date('2024-05-12'),
//     expectedReturnDate: new Date('2024-05-19'),
//     returnDate: null,
//   },
//   {
//     _id: 'r7',
//     userId: 'u7',
//     filmId: 'f7',
//     userName: 'Pedro Ramírez',
//     filmName: 'La La Land',
//     price: 19,
//     bookDate: new Date('2024-05-13'),
//     rentalDate: new Date('2024-05-14'),
//     expectedReturnDate: new Date('2024-05-21'),
//     returnDate: new Date('2024-05-22'),
//   },
// ];

  orderBy: keyof Rental = 'userName';
  orderDirection: 'asc' | 'desc' = 'asc';
  // Variable para busqueda activa por texto
  searchText: string = '';
  mostrarEntregados = signal(true);
  selectedRental: Rental | null = null;

  rentals = signal<Rental[]>([]);

  rentalsFiltrados = computed(() =>
    this.rentals().filter((rental) =>
      this.mostrarEntregados() ? true : !rental.returnDate
    )
  );

  constructor(private rentalsService: RentalsService, private router: Router) {
    this.rentals = this.rentalsService.rentals;
    // this.rentals.set(this.testRentals);
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
    // console.log('Selected rental:', this.selectedRental);

    if (this.selectedRental) {
      const rentalId =
        this.selectedRental._id || (this as any).selectedRental.id;

      this.rentalsService.returnRental(rentalId).subscribe({
        next: () => {
          this.selectedRental = null;
        },
        error: (err) => {
          console.error('Error devolviendo la película:', err);
        },
      });
    }
  }

  returnRentalAsync(id: string, returnDate: string): Promise<Rental> {
    return new Promise((resolve, reject) => {
      this.rentalsService.updateRental(id, { returnDate }).subscribe({
        next: (updatedRental) => resolve(updatedRental),
        error: (err) => reject(err),
      });
    });
  }
}
