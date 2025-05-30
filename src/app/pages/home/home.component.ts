import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { SlicePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';



@Component({
  selector: 'home',
  imports: [TitleCasePipe, SlicePipe, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  //Mock DataHome
  // mockDataHome: DataMoviesNews = {
  //   NewestFilm: {
  //     _id: '1',
  //     title: 'Inception',
  //     genre: MovieGenre.SciFi,
  //     release: new Date('2010-07-16'),
  //     director: 'Christopher Nolan',
  //     duration: 148,
  //     stock: 12,
  //     rental_price: 3.99,
  //     description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an _idea.'
  //   },
  //   TotalFilms: 120,
  //   OldestFilm: {
  //     _id: '2',
  //     title: 'Metropolis',
  //     genre: MovieGenre.SciFi,
  //     release: new Date('1927-01-10'),
  //     director: 'Fritz Lang',
  //     duration: 153,
  //     stock: 3,
  //     rental_price: 2.99,
  //     description: 'A futuristic city where a creative genius attempts to br_idge the div_ide between the working class and the city planners.'
  //   },
  //   CheapestFilm: {
  //     _id: '3',
  //     title: 'Parasite',
  //     genre: MovieGenre.Drama,
  //     release: new Date('2019-05-30'),
  //     director: 'Bong Joon-ho',
  //     duration: 132,
  //     stock: 7,
  //     rental_price: 4.99,
  //     description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
  //   },
  //   LonguestFilm: {
  //     _id: '4',
  //     title: 'The Irishman',
  //     genre: MovieGenre.Drama,
  //     release: new Date('2019-11-01'),
  //     director: 'Martin Scorsese',
  //     duration: 209,
  //     stock: 5,
  //     rental_price: 4.99,
  //     description: 'An aging hitman recalls his past with the mob and his involvement in the disappearance of Jimmy Hoffa.'
  //   },
  //   ExpensiveFilm: {
  //     _id: '5',
  //     title: 'Avengers: Endgame',
  //     genre: MovieGenre.Action,
  //     release: new Date('2019-04-26'),
  //     director: 'Anthony and Joe Russo',
  //     duration: 181,
  //     stock: 10,
  //     rental_price: 5.99,
  //     description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more in order to reverse Thanos\' actions.'
  //   }
  // };

  moviesService = inject(MoviesService);
  // dataHome = signal<DataMoviesNews| null>(null);
  // movieMockResponse = this.mockDataHome;//cambiarlo por el de abajo

  movieNewsResource = rxResource({
      request: () => ({}),
      loader: () => {
        return this.moviesService.getHomeInfo()
      }
    });

  ngOnInit() {
    this.movieNewsResource;

  }

}
