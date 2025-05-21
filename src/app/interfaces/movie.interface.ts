import { MovieGenre } from "./movie-genre.enum";

export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
  release: number; // Pasar a Date o String (Pendiente de back)
  director: string;
  duration: number;
  stock: number;
  rental_price: number;
  description: string;
}
