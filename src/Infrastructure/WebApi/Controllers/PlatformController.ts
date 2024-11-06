import { Database, MySqlRepository, type Platform } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { User } from '../mod.ts';
import { Context } from '@oak/oak';

export class PlatformController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

   async getPlatforms(): Promise<Platform[]> {
        try {
            const platforms = await this.repository.getPlatforms();
            return platforms;
        } catch (error) {
            throw error;
        }
   }

   async addPlatform(platform: Platform): Promise<number> {
        try {
            const platformId = await this.repository.addPlatform(platform);
            return platformId;
        } catch (error) {
            throw error;
        }
   }

    async deletePlatform(platformId: number): Promise<void> {
          try {
                await this.repository.deletePlatform(platformId);
          } catch (error) {
                throw error;
          }
    }

    async getPlatform(platformId: number): Promise<Platform> {
        try {
            const platform = await this.repository.getPlatform(platformId);
            return platform;
        } catch (error) {
            throw error;
        }
    }
}