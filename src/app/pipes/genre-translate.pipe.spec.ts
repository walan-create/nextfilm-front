import { GenreTranslatePipe } from "./genre-translate.pipe"

describe('GenreTranslatePipe', () => {
    let pipe: GenreTranslatePipe;

    beforeEach(() => {
        pipe = new GenreTranslatePipe();
    });

    it('should find the value input in the genreMap record if its defined', () => {
        const result = pipe.transform('ACTION')
        expect(result).toBe('Acción')
    })

    it('should translate the value input if it is not defined in the genreMap record', () => {
        const result = pipe.transform('genero')
        expect(result).toBe('Genero')
    })
})