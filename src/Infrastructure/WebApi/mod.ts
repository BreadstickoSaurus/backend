export { WebApiModule } from '../WebApi/WebApiModule.ts';

export { endpoints } from '../WebApi/Endpoints.ts';
export type { Endpoint } from './Shared/Endpoint.ts';
export { RootEndpoint } from './Endpoints/RootEndpoint.ts';
export { RegisterEndpoint } from './Endpoints/RegisterEndpoint.ts';
export { LoginEndpoint } from './Endpoints/LoginEndpoint.ts';
export { AddGameToColEndpoint } from './Endpoints/AddGameToColEndpoint.ts';

export { Database } from './db/Database.ts';
export type { User } from './db/models/UserModel.ts';
export type { Game } from './db/models/GameModel.ts';

export { MySqlRepository } from './Repositories/MySqlRepository.ts';

export { RegisterController } from './Controllers/RegisterController.ts';
export { LoginController } from './Controllers/LoginController.ts';
export {  AddGameToColController } from './Controllers/AddGameToColController.ts';

export { ValidationError, AuthenticationError, ForeignKeyError } from './Shared/Errors.ts';
