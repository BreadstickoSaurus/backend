import { Database, MySqlRepository } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { User } from '../mod.ts';
import { Context } from '@oak/oak';

export class AuthenticationController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }

    async registerUser(name:string, password:string): Promise<void> {
        const user: User = {
            name: name,
            password: password
        };

        try{
            await this.repository.registerUser(user);    
        } catch(error){
            throw error;
        }
    }

    async loginUser(name:string, password:string): Promise<number> {
        const user: User = {
            name: name,
            password: password
        };

        try{
            const result = await this.repository.loginUser(user);   
            return result;
        } catch(error){
            throw error;
        }
        
    }
}