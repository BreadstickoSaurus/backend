import { Database } from '../../WebApi/mod.ts';
import { ServiceLocator } from '../mod.ts';
import { MySqlRepository } from '../../WebApi/mod.ts';

export class ServiceRegistration {
    static registerServices(): void {
        const db = new Database();
        // Initialize the database connection if needed
        db.connect();

        ServiceLocator.register('database', db);
        ServiceLocator.register('MySqlRepository', new MySqlRepository(db));
    }
}
