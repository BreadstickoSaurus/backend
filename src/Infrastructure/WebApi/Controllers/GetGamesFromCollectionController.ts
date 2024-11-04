import { ServiceLocator } from '../../Shared/mod.ts';
import type { Game, MySqlRepository } from '../mod.ts';

export class GetGamesFromCollectionController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

    async getGamesFromCollection(userId: number): Promise<Game[]> {
        try{
            const games = await this.repository.getGamesFromCol(userId);
            return games;
        } catch(error){
            throw error;
        }
    }
}