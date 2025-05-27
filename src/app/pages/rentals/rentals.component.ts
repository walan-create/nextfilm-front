import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReusableModalComponent } from '../../components/reusable-modal/reusable-modal.component';
import { RentalsService, Rental } from '../../services/rentals.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReusableModalComponent],
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css']
})
export class RentalsComponent {
  mostrarEntregados = true;
  selectedRental: Rental | null = null;

  rentals = signal<Rental[]>([]); // inicializa vacío

  rentalsFiltrados = computed(() =>
    this.mostrarEntregados
      ? this.rentals()
      : this.rentals().filter(r => !r.returnDate)
  );

  constructor(private rentalsService: RentalsService,private router: Router) {
    this.rentals = this.rentalsService.rentals; // asigna el signal desde el servicio
    this.rentalsService.loadRentals().subscribe(); // hace GET al backend y setea el signal
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
  newRental(){
    this.router.navigate(['/rentals/new'])
  }
}
