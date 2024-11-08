import { ServiceLocator } from '../../Shared/mod.ts';
import type { MySqlRepository } from '../mod.ts';


export class AltTitleController {
    private repository: MySqlRepository

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

    async addAltTitlesToGame(gameId: number, altTitles: string[]): Promise<void> {
        try {
            await this.repository.addAltTitlesToGame(gameId, altTitles);
        }
        catch (error) {
            throw error;
        }
    }

    async deleteAltTitlesFromGame(gameId: number, altTitles: string[]): Promise<void> {
        try {
            await this.repository.deleteAltTitlesFromGame(gameId, altTitles);
        }
        catch (error) {
            throw error;
        }
    }

}