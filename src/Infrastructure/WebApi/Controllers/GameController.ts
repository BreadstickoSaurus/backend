import { ServiceLocator } from '../../Shared/mod.ts';
import type { MySqlRepository, GameFull, Game } from '../mod.ts';

export class GameController {
    private repository: MySqlRepository

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

    async getCollectionId(gameId: number): Promise<number> {
        try {
            const collectionId = await this.repository.getCollectionIdByGameId(gameId);
            return collectionId;
        }
        catch (error) {
            throw error;
        }
    }

    async getWishlistValue(gameId: number): Promise<number> {
        try {
            const wishlistValue = await this.repository.getWishlistValue(gameId);
            return wishlistValue;
        }
        catch (error) {
            throw error;
        }
    }

    async updateGame(gameId: number, data: Game): Promise<number> {
        try {
            const game = await this.repository.updateGame(gameId,data);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async updateAltTitles(gameId: number, altTitles: string[]): Promise<void> {
        try {
            const game = await this.repository.updateAltTitles(gameId, altTitles);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async getGamesFromCollection(userId: number): Promise<Game[]> {
        try{
            const games = await this.repository.getGamesFromCol(userId);
            return games;
        } catch(error){
            throw error;
        }
    }

    async getGameFromWishlist(userId: number): Promise<Game[]> {
        try{
            const games = await this.repository.getGamesFromWishlist(userId);
            return games;
        } catch(error){
            throw error;
        }
    }

    async getGameDetails(gameId: number): Promise<GameFull> {
        try {
            const game = await this.repository.getGameDetails(gameId);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteGame(gameId: number): Promise<void> {
        try {
            await this.repository.deleteGame(gameId);
        }
        catch (error) {
            throw error;
        }
    }

    async addGameToCol(userId: number, data: Game): Promise<number> {
        data.collectionId = await this.repository.getCollectionId(userId);
        try{
            const gameId = await this.repository.addGameToCol(data);
            return gameId;
        } catch(error){
            throw error;
        }
    }
}