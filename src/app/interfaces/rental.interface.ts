export interface Rental {
  _id: string; //!ojo en el swagger tiene el nombre de renralID con la D mayuscula
  userId: string;
  filmId: string;

  userName: string;
  filmName: string;

  price: number;
  bookDate: Date | null; // formato ISO (YYYY-MM-DD)
  rentalDate: Date | null; // formato ISO (YYYY-MM-DD)
  expectedReturnDate: Date | null; // formato ISO (YYYY-MM-DD)
  returnDate: Date | null; // formato ISO (YYYY-MM-DD)
}
