import { provideHttpClient } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MoviesService } from "../../services/movies.service";
import { RentalsService } from "../../services/rentals.service";
import { MovieDetailsPageComponent } from "../movieDetails-page/movieDetails-page.component";
import { MovieGenre } from "../../interfaces/movie-genre.enum";
import { Movie } from "../../interfaces/movie.interface";
import { of } from "rxjs";
import { EditMoviePageComponent } from "./editMovie-page.component";
import { ActivatedRoute, Router } from "@angular/router";

const mockMovie: Movie = {
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

describe('EditMoviePageComponent', () => {
    let fixture: ComponentFixture<EditMoviePageComponent>;
    let compiled: HTMLElement;
    let component: EditMoviePageComponent;
    let moviesService: MoviesServiceMock
    let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMoviePageComponent,
      ],
      providers: [
        provideHttpClient(),
        {provide: MoviesService, useClass: MoviesServiceMock},
        {provide: ActivatedRoute, useValue: {params: of({id: 'mock-id'})}}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMoviePageComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as unknown as MoviesServiceMock
    router = TestBed.inject(Router)

    })
    it('should create', () =>{
        expect(component).toBeTruthy()
    })

    it('should load the resource correctly', async() => {
        moviesService.getMovieById.and.returnValue(of(mockMovie));
        
        fixture.detectChanges()
    
        component.movieResource.reload();
    
        await fixture.whenStable();
    
        expect(moviesService.getMovieById).toHaveBeenCalled();
    
        const result = component.movieResource.value();
        expect(result).toEqual(mockMovie);
    })

    it('should redirect to admin when there is an error', () => {
        spyOn(component.movieResource, 'error').and.returnValue(true);

        const spyRouter = spyOn(router, 'navigate')

        fixture.detectChanges();

        expect(spyRouter).toHaveBeenCalledWith(['/admin']);
    })
});