import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { HomeComponent } from "./home.component";
import { MoviesService } from "../../services/movies.service";
import { of } from "rxjs";
import { DataMoviesNews } from "../../interfaces/data-movies-news.interface";
import { Movie } from "../../interfaces/movie.interface";
import { MovieGenre } from "../../interfaces/movie-genre.enum";

const mockMovie: Movie = {
  _id: '1',
  title: 'Mock Movie',
  genre: MovieGenre.Action,
  release: new Date('2020-01-01'),
  director: 'Mock Director',
  duration: 120,
  stock: 10,
  rental_price: 3.99,
  description: 'Mock description'
};

const mockDataMoviesNews: DataMoviesNews = {
  LatestFilm: mockMovie,
  TotalFilms: 1,
  OldestFilm: mockMovie,
  CheapestFilm: mockMovie,
  LonguestFilm: mockMovie,
  ExpensiveFilm: mockMovie
};

class MoviesServiceMock {
  getHomeInfo = jasmine.createSpy('getHomeInfo').and.returnValue(of(mockDataMoviesNews));
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let moviesService: MoviesServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: MoviesService, useClass: MoviesServiceMock },
        provideHttpClient(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as unknown as MoviesServiceMock;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('movieNewsResource', () => {
    it('should load movieNewsResource correctly', async () => {
      expect(moviesService.getHomeInfo).toHaveBeenCalled();

      await fixture.whenStable();

      const result = component.movieNewsResource.value();
      expect(result).toEqual(mockDataMoviesNews);
    });
  });
});
