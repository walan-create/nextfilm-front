import { Component, NgModule, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ServiceNameServices } from '../../services/user.service';
import { MoviesService } from '../../services/movies.service';
import { RentalsService } from '../../services/rentals.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-rental',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-rental.component.html'
})
export class NewRentalComponent implements OnInit {
  loaded = false;
  usersReady = false;
  moviesReady = false;

  users: any[] = [];
  movies: any[] = [];

  selectedUserId: string = '';
  selectedMovieId: string = '';
  selectedPrice: number = 0;

  constructor(
    private userService: ServiceNameServices,
    private moviesService: MoviesService,
    private rentalService: RentalsService,
    private cdr: ChangeDetectorRef,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersReady = true;
        this.checkLoaded();
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });

    this.moviesService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.moviesReady = true;
        this.checkLoaded();
      },
      error: (err) => console.error('Error al obtener películas:', err)
    });
  }

checkLoaded(): void {
  if (this.usersReady && this.moviesReady) {
    this.loaded = true;
    // console.log("loaded:", this.loaded);
    this.cdr.detectChanges();
  }
}



  updatePrice(): void {
    const selectedMovie = this.movies.find(m => m._id === this.selectedMovieId);
    this.selectedPrice = selectedMovie ? selectedMovie.rental_price : 0;
  }



  saveRental(): void {
  if (!this.selectedUserId || !this.selectedMovieId || !this.selectedPrice) {
    alert('Faltan datos para guardar el alquiler');
    return;
  }

  const rental = {
    userId: this.selectedUserId,
    filmId: this.selectedMovieId,
    price: this.selectedPrice
  };

  this.rentalService.createRental(rental).subscribe({
  next: () => {
    this.selectedUserId = this.selectedUserId;
    this.selectedMovieId = this.selectedMovieId;
    this.selectedPrice = this.selectedPrice;
  },
  error: (err) => {
    if (err.status === 400 && err.error?.error) {
      alert(err.error.error);
    } else {
      alert('Error al guardar el alquiler');
    }
  }
});

}


}
