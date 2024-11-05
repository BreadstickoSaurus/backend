import { ServiceLocator } from '../../Shared/mod.ts';
import type { MySqlRepository, GameFull, Game } from '../mod.ts';

export class UpdateGameController {
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
}