import { Database, MySqlRepository, type State } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';

export class StateController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getStates(): Promise<State[]> {
        try {
            const states = await this.repository.getStates();
            return states;
        } catch (error) {
            throw error;
        }
   }
}