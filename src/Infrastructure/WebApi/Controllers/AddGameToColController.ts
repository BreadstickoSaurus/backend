import { MySqlRepository, Game } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';

export class AddGameToColController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
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