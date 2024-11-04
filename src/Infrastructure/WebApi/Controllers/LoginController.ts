import { MySqlRepository } from '../mod.ts';
import { ServiceLocator } from '../../Shared/mod.ts';
import { User } from '../mod.ts';

export class LoginController{
    private repository: MySqlRepository;

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
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