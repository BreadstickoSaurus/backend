import { Database, MySqlRepository, type Publisher } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { User } from '../mod.ts';
import { Context } from '@oak/oak';

export class PublisherController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getPublishers(): Promise<Publisher[]> {
        try {
            const publishers = await this.repository.getPublishers();
            return publishers;
        } catch (error) {
            throw error;
        }
   }

   async addPublisher(publisher: Publisher): Promise<number> {
        try {
            const publisherId = await this.repository.addPublisher(publisher);
            return publisherId;
        } catch (error) {
            throw error;
        }
   }

    async deletePublisher(publisherId: number): Promise<void> {
          try {
                await this.repository.deletePublisher(publisherId);
          } catch (error) {
                throw error;
          }
    }

    async getPublisher(publisherId: number): Promise<Publisher> {
        try {
            const platform = await this.repository.getPublisher(publisherId);
            return platform;
        } catch (error) {
            throw error;
        }
    }
}