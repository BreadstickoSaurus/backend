export { WebApiModule } from '../WebApi/WebApiModule.ts';

export { endpoints } from '../WebApi/Endpoints.ts';
export type { Endpoint } from './Shared/Endpoint.ts';
export { RootEndpoint } from './Endpoints/RootEndpoint.ts';
export { RegisterEndpoint } from './Endpoints/RegisterEndpoint.ts';
export { LoginEndpoint } from './Endpoints/LoginEndpoint.ts';
export { AddGameToColEndpoint } from './Endpoints/AddGameToColEndpoint.ts';
export { AddGameToWishlistEndpoint } from './Endpoints/AddGameToWishlistEndpoint.ts';
export { GetGamesFromCollectionEndpoint } from './Endpoints/GetGamesFromCollectionEndpoint.ts';
export { GetGamesFromWishlistEndpoint } from './Endpoints/GetGamesFromWishlistEndpoint.ts';
export { GetGameDetailsEndpoint } from './Endpoints/GetGameDetailsEndpoint.ts';
export { UpdateGameEndpoint } from './Endpoints/UpdateGameEndpoint.ts';
export { AddImageToGameEndpoint } from './Endpoints/AddImageToGameEndpoint.ts';
export { getImageUrlsFromGame } from './Endpoints/getImageUrlsFromGame.ts';
export { DeleteImageFromGame } from './Endpoints/DeleteImageFromGame.ts';

export { Database } from './db/Database.ts';
export type { User } from './db/models/UserModel.ts';
export type { Game } from './db/models/GameModel.ts';
export type { GameFull } from './db/models/GameFullModel.ts';
 
export { MySqlRepository } from './Repositories/MySqlRepository.ts';

export { RegisterController } from './Controllers/RegisterController.ts';
export { LoginController } from './Controllers/LoginController.ts';
export { AddGameToColController } from './Controllers/AddGameToColController.ts';
export { GetGamesFromCollectionController } from './Controllers/GetGamesFromCollectionController.ts';
export { GetGameDetailsController } from './Controllers/GetGameDetailsController.ts';
export { UpdateGameController } from './Controllers/UpdateGameController.ts';
export { ImageController } from './Controllers/ImageController.ts';

export { ValidationError, AuthenticationError, ForeignKeyError } from './Shared/Errors.ts';

export { staticFileMiddleware } from './Middleware/staticFileMiddleware.ts';