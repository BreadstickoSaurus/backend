// import { WebAppModule } from 'HelloWorld/Infrastructure/WebApp/mod.ts';
// import { WebApiModule } from 'HelloWorld/Infrastructure/WebApi/mod.ts';

import { WebApiModule } from './Infrastructure/WebApi/WebApiModule.ts';
const webApiModule = new WebApiModule(8888);
webApiModule.run();
