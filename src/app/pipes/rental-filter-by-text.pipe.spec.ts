import { Rental } from "../interfaces/rental.interface";
import { RentalFilterByTextPipe } from "./rental-filter-by-text.pipe";

const mockRentals: Rental[] = [
  {
  _id: '1',
  userId: '2',
  filmId: '3',
  userName: 'Pepe',
  filmName: 'Ejemplo',
  price: 12345,
  bookDate: null,
  rentalDate: null, // formato ISO (YYYY-MM-DD)
  expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
  returnDate: null, // formato ISO (YYYY-MM-DD)
  },

{
  _id: '4',
  userId: '5',
  filmId: '6',
  userName: 'Antonio',
  filmName: 'Prueba',
  price: 20,
  bookDate: null,
  rentalDate: new Date('2020-01-01'), // formato ISO (YYYY-MM-DD)
  expectedReturnDate: new Date('2021-02-02'), // formato ISO (YYYY-MM-DD)
  returnDate: new Date('2022-03-03'), // formato ISO (YYYY-MM-DD)
  }
  
];

describe('RentalFilterByTextPipe', () => {
  let pipe: RentalFilterByTextPipe;

  beforeEach(() => {
    pipe = new RentalFilterByTextPipe();
  });

   it('should return the array without changes when there is no search input', () => {
    const data = mockRentals
    const result = pipe.transform(data, '')
    expect(result).toEqual(data)
  })

    it('should filter by filmName', () => {
      const data = mockRentals
      const result = pipe.transform(data, 'ejemplo')
      expect(result).toEqual([    
        {
            _id: '1',
            userId: '2',
            filmId: '3',
            userName: 'Pepe',
            filmName: 'Ejemplo',
            price: 12345,
            bookDate: null,
            rentalDate: null, // formato ISO (YYYY-MM-DD)
            expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
            returnDate: null, // formato ISO (YYYY-MM-DD)
        }
      ])
    })

    it('should filter by price', () => {
      const data = mockRentals
      const result = pipe.transform(data, '12345')
      expect(result).toEqual([{
      _id: '1',
      userId: '2',
      filmId: '3',
      userName: 'Pepe',
      filmName: 'Ejemplo',
      price: 12345,
      bookDate: null,
      rentalDate: null, // formato ISO (YYYY-MM-DD)
      expectedReturnDate: null, // formato ISO (YYYY-MM-DD)
      returnDate: null, // formato ISO (YYYY-MM-DD)
      }])
    })

    it('should filter by rental date', () => {
      const data = mockRentals
      const result = pipe.transform(data, '2020-01-01')
      expect(result).toEqual([{
        _id: '4',
        userId: '5',
        filmId: '6',
        userName: 'Antonio',
        filmName: 'Prueba',
        price: 20,
        bookDate: null,
        rentalDate: new Date('2020-01-01'), // formato ISO (YYYY-MM-DD)
        expectedReturnDate: new Date('2021-02-02'), // formato ISO (YYYY-MM-DD)
        returnDate: new Date('2022-03-03'), // formato ISO (YYYY-MM-DD)
    }])
  })

    it('should filter by expected return date', () => {
      const data = mockRentals
      const result = pipe.transform(data, '2021-02-02')
      expect(result).toEqual([{
        _id: '4',
        userId: '5',
        filmId: '6',
        userName: 'Antonio',
        filmName: 'Prueba',
        price: 20,
        bookDate: null,
        rentalDate: new Date('2020-01-01'), // formato ISO (YYYY-MM-DD)
        expectedReturnDate: new Date('2021-02-02'), // formato ISO (YYYY-MM-DD)
        returnDate: new Date('2022-03-03'), // formato ISO (YYYY-MM-DD)
    }])
  })

    it('should return false when date is not found', () => {
      const data = mockRentals
      const result = pipe.transform(data, '2046-09-09')
  })

})