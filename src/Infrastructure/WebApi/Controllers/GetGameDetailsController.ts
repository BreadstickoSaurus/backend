import { ServiceLocator } from '../../Shared/mod.ts';
import type { Game, GameFull, MySqlRepository } from '../mod.ts';

export class GetGameDetailsController {
    private repository: MySqlRepository

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
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
}