import { WebApiModule } from './Infrastructure/WebApi/mod.ts';
import { ServiceRegistration } from './Infrastructure/Shared/mod.ts';


async function main() {
    ServiceRegistration.registerServices();
    const webApiModule = new WebApiModule(8888);
    
    // Run the WebApiModule
    await webApiModule.run();
}

// Start the application and handle any errors
main().catch(err => console.error(err));
