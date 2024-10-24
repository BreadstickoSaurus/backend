// import { WebAppModule } from 'HelloWorld/Infrastructure/WebApp/mod.ts';
// import { WebApiModule } from 'HelloWorld/Infrastructure/WebApi/mod.ts';

import { WebApiModule } from './Infrastructure/WebApi/mod.ts';
import { Database } from './Infrastructure/WebApi/mod.ts';
import { ServiceLocator } from './Infrastructure/Shared/mod.ts';

import { MySqlRepository } from './Infrastructure/WebApi/mod.ts';


async function main() {
    const db = new Database(); 
    await db.connect();


    //put this in  another class/function
    ServiceLocator.register('database', db);
    ServiceLocator.register('MySqlRepository', new MySqlRepository(db));

    const webApiModule = new WebApiModule(8888);
    
    // Run the WebApiModule
    await webApiModule.run();
}

// Start the application and handle any errors
main().catch(err => console.error(err));
