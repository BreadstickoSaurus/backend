import { Database, MySqlRepository, type Developer } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { Context } from '@oak/oak';

export class DeveloperController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getDevelopers(): Promise<Developer[]> {
        try {
            const developers = await this.repository.getDevelopers();
            return developers;
        } catch (error) {
            throw error;
        }
   }

   async addDeveloper(developer: Developer): Promise<number> {
        try {
            const devloperId = await this.repository.addDeveloper(developer);
            return devloperId;
        } catch (error) {
            throw error;
        }
   }

    async deleteDeveloper(developerId: number): Promise<void> {
          try {
                await this.repository.deleteDeveloper(developerId);
          } catch (error) {
                throw error;
          }
    }

    async getDeveloper(developerId: number): Promise<Developer> {
        try {
            const developer = await this.repository.getDeveloper(developerId);
            return developer;
        } catch (error) {
            throw error;
        }
    }
}