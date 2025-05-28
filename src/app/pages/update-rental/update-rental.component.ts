import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceNameServices } from '../../services/user.service';
import { MoviesService } from '../../services/movies.service';
import { RentalsService, Rental } from '../../services/rentals.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-rental',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-rental.component.html',
  styleUrls: ['./update-rental.component.css']
})
export class UpdateRentalComponent implements OnInit {
  loaded = false;
  usersReady = false;
  moviesReady = false;
  rentalReady = false;
  expectedReturnDate: string = '';

  users: any[] = [];
  movies: any[] = [];

  rentalId: string = '';
  selectedUserId: string = '';
  selectedMovieId: string = '';
  selectedPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rentalService: RentalsService,
    private userService: ServiceNameServices,
    private moviesService: MoviesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.rentalId = this.route.snapshot.params['id'];

    // Cargar usuarios
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersReady = true;
        this.checkLoaded();
      }
    });

    // Cargar películas
    this.moviesService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.moviesReady = true;
        this.checkLoaded();
      }
    });

    // Cargar alquiler por ID
    this.rentalService.getRentalById(this.rentalId).subscribe({
      next: (rental: Rental) => {
        this.selectedUserId = rental.userId;
        this.selectedMovieId = rental.filmId;
        console.log(rental)
        this.selectedPrice = rental.price;
        const fecha = new Date(rental.expectedReturnDate!);
        this.expectedReturnDate = this.formatDateToInput(fecha).toString();

        // '2025-05-28' ;

        //        this.expectedReturnDate = rental.expectedReturnDate;
        // console.log(this.expectedReturnDate);
        //this.formatDateToInput(rental.expectedReturnDate!)
        // `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDay()}`
        // rental.expectedReturnDate?.toISOString()!
        // rental.expectedReturnDate.toString();

        this.rentalReady = true;
        this.checkLoaded();
      }

    });
  }


  get fecha(): string {
    return this.expectedReturnDate ?? '';
  }

  formatDateToInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  checkLoaded(): void {
    if (this.usersReady && this.moviesReady && this.rentalReady) {
      this.loaded = true;
      this.cdr.detectChanges();
    }
  }

  updatePrice(): void {
    const selectedMovie = this.movies.find(m => m._id === this.selectedMovieId);
    this.selectedPrice = selectedMovie ? selectedMovie.rental_price : 0;
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.expectedReturnDate = input.value;
  }


  updateRental(): void {
    if (!this.selectedUserId || !this.selectedMovieId || !this.selectedPrice) {
      alert('Faltan datos para actualizar el alquiler');
      return;
    }

    const data = {
      userId: this.selectedUserId,
      filmId: this.selectedMovieId,
      price: this.selectedPrice,
      expectedReturnDate: this.expectedReturnDate ? new Date(this.expectedReturnDate) : undefined
    };

    this.rentalService.updateRental(this.rentalId, data).subscribe({
      next: () => {
        alert('Alquiler actualizado correctamente');
        this.router.navigate(['/rentals']);
      },
      error: () => {
        alert('Película ya reservada a ese cliente');
      }
    });
  }

}
