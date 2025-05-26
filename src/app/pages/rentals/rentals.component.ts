import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';

interface Rental {
  user: string;
  film: string;
  price: number;
  rentalDate: Date;
  expectedReturnDate: Date;
  returnDate: Date | null;
}

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReusableModalComponent],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent {
  rentals: Rental[] = [
    {
      user: 'Maria Lopez',
      film: 'The Godfather',
      price: 3.99,
      rentalDate: new Date('2025-05-01'),
      expectedReturnDate: new Date('2025-05-15'),
      returnDate: new Date('2025-05-12')
    },
    {
      user: 'Carlos Ruiz',
      film: 'Inception',
      price: 2.49,
      rentalDate: new Date('2025-05-10'),
      expectedReturnDate: new Date('2025-05-24'),
      returnDate: null
    }
  ];

  mostrarEntregados = true;
  selectedRental: Rental | null = null;

  get rentalsFiltrados(): Rental[] {
    if (this.mostrarEntregados) {
      return this.rentals;
    } else {
      return this.rentals.filter(r => !r.returnDate);
    }
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
    if (this.selectedRental) {
      this.selectedRental.returnDate = new Date();
      this.selectedRental = null;
    }
  }
}
