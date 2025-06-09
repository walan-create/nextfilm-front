import { ComponentFixture, TestBed } from "@angular/core/testing"
import { provideHttpClient } from "@angular/common/http"
import { CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA } from "@angular/core"
import { MoviesService } from "../../services/movies.service"
import { of } from "rxjs"
import { MovieGenre } from "../../interfaces/movie-genre.enum"
import { Movie } from "../../interfaces/movie.interface"
import { provideRouter, Router } from "@angular/router"
import { MovieInfoComponent } from "./movie-info.component"

const emptyMovie: Movie = {
  _id: '',
  title: '',
  genre: MovieGenre.Action,
  release: new Date(),
  director: '',
  duration: 0,
  stock: 0,
  rental_price: 0,
  description: '',
};

class MoviesServiceMock {
    getMovieById = jasmine.createSpy('getMovieById')
}

describe('MovieInfoComponent', () => {
    let fixture: ComponentFixture<MovieInfoComponent>
    let compiled: HTMLElement
    let component: MovieInfoComponent
    let moviesService: MoviesServiceMock
    let router: Router

    beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieInfoComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {provide: MoviesService, useClass:MoviesServiceMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieInfoComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as unknown as MoviesServiceMock
    router = TestBed.inject(Router)

  })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should load movieResource', async() => {

        moviesService.getMovieById.and.returnValue(of(emptyMovie));
    
        fixture.detectChanges()
    
        component.movieResource.reload();
    
        await fixture.whenStable();
    
        expect(moviesService.getMovieById).toHaveBeenCalled();
    
        const result = component.movieResource.value();
        expect(result).toEqual((emptyMovie));
    } )
})