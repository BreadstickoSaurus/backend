import { Database, MySqlRepository, type Genre } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { Context } from '@oak/oak';

export class GenreController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getGenres(): Promise<Genre[]> {
        try {
            const genres = await this.repository.getGenres();
            return genres;
        } catch (error) {
            throw error;
        }
   }

   async addGenre(genre: Genre): Promise<number> {
        try {
            const genreId = await this.repository.addGenre(genre);
            return genreId;
        } catch (error) {
            throw error;
        }
   }

    async deleteGenre(genreId: number): Promise<void> {
          try {
                await this.repository.deleteGenre(genreId);
          } catch (error) {
                throw error;
          }
    }

    async getGenre(genreId: number): Promise<Genre> {
        try {
            const genre = await this.repository.getGenre(genreId);
            return genre;
        } catch (error) {
            throw error;
        }
    }
}