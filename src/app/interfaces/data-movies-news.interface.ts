import { Movie } from "./movie.interface";

export interface DataMoviesNews {
  NewestFilm: Movie;
  TotalFilms: number;
  OldestFilm: Movie;
  CheapestFilm: Movie;
  LonguestFilm: Movie;
  ExpensiveFilm: Movie;
}

