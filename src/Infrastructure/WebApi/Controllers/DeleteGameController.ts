import { ServiceLocator } from '../../Shared/mod.ts';
import type { Game, GameFull, MySqlRepository } from '../mod.ts';

export class DeleteGameController {
    private repository: MySqlRepository

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }
    async deleteGame(gameId: number): Promise<void> {
        try {
            await this.repository.deleteGame(gameId);
        }
        catch (error) {
            throw error;
        }
    }
}