import { Database, MySqlRepository, type Country } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';

export class CountryController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getCountries(): Promise<Country[]> {
        try {
            const countries = await this.repository.getCountries();
            return countries;
        } catch (error) {
            throw error;
        }
   }
}