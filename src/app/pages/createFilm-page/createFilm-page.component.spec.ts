import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CreateFilmPageComponent } from "./createFilm-page.component"
import { provideHttpClient } from "@angular/common/http"
import { CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA } from "@angular/core"
import { MoviesService } from "../../services/movies.service"
import { of } from "rxjs"
import { MovieGenre } from "../../interfaces/movie-genre.enum"
import { Movie } from "../../interfaces/movie.interface"
import { provideRouter, Router } from "@angular/router"

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

describe('CreateFilmPageComponent', () => {
    let fixture: ComponentFixture<CreateFilmPageComponent>
    let compiled: HTMLElement
    let component: CreateFilmPageComponent
    let moviesService: MoviesServiceMock
    let router: Router

    beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFilmPageComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {provide: MoviesService, useClass:MoviesServiceMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFilmPageComponent);
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

    it('should redirect to admin when there is an error', () => {
        spyOn(component.movieResource, 'error').and.returnValue(true);
        const spyRouter = spyOn(router, 'navigate')

        fixture.detectChanges();

        expect(spyRouter).toHaveBeenCalledWith(['/admin']);
    })
})