import { MovieGenre } from '../interfaces/movie-genre.enum';
import { Movie } from '../interfaces/movie.interface';
import { FilterByTextPipe } from './filter-by-text.pipe';

const mockMovies: Movie[] = [
    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },

    {
        _id: '2',
        title: 'Empty Film',
        genre: MovieGenre.Drama,
        release: new Date('2024-01-01'),
        director: 'Yo',
        duration: 100,
        stock: 9,
        rental_price: 15,
        description: 'An empty film',
    }

]

describe('FilterByTextPipe', () => {
  let pipe: FilterByTextPipe;

  beforeEach(() => {
    pipe = new FilterByTextPipe();
  });

  it('should return the movies array without changes when there is no search input', () => {
    const data = mockMovies
    const result = pipe.transform(data, '')
    expect(result).toEqual(data)
  })

  it('should filter by title', () => {
    const data = mockMovies
    const result = pipe.transform(data, 'MOVIE')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })

    it('should filter by director', () => {
    const data = mockMovies
    const result = pipe.transform(data, 'Director')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })

    it('should filter by genre', () => {
    const data = mockMovies
    const result = pipe.transform(data, 'Action')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })

    it('should filter by description', () => {
    const data = mockMovies
    const result = pipe.transform(data, 'A test')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })

    it('should filter by duration', () => {
    const data = mockMovies
    const result = pipe.transform(data, '120')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })

    it('should filter by release', () => {
    const data = mockMovies
    const result = pipe.transform(data, '2020-03-05')
    expect(result).toEqual([    {
        _id: '1',
        title: 'Test Movie',
        genre: MovieGenre.Action,
        release: new Date('2020-03-05'),
        director: 'Test Director',
        duration: 120,
        stock: 5,
        rental_price: 10,
        description: 'A test movie',
        
    },
    ])
  })
})