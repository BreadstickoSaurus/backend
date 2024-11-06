export { WebApiModule } from '../WebApi/WebApiModule.ts';

export { endpoints } from '../WebApi/Endpoints.ts';
export type { Endpoint } from './Shared/Endpoint.ts';
export { RootEndpoint } from './Endpoints/RootEndpoint.ts';
export { RegisterEndpoint } from './Endpoints/Authentication/RegisterEndpoint.ts';
export { LoginEndpoint } from './Endpoints/Authentication/LoginEndpoint.ts';
export { AddGameToColEndpoint } from './Endpoints/Games/AddGameToColEndpoint.ts';
export { AddGameToWishlistEndpoint } from './Endpoints/Games/AddGameToWishlistEndpoint.ts';
export { GetGamesFromCollectionEndpoint } from './Endpoints/Games/GetGamesFromCollectionEndpoint.ts';
export { GetGamesFromWishlistEndpoint } from './Endpoints/Games/GetGamesFromWishlistEndpoint.ts';
export { GetGameDetailsEndpoint } from './Endpoints/Games/GetGameDetailsEndpoint.ts';
export { UpdateGameEndpoint } from './Endpoints/Games/UpdateGameEndpoint.ts';
export { AddImageToGameEndpoint } from './Endpoints/Images/AddImageToGameEndpoint.ts';
export { getImageUrlsFromGame } from './Endpoints/Images/getImageUrlsFromGame.ts';
export { DeleteImageFromGameEndpoint } from './Endpoints/Images/DeleteImageFromGameEndpoint.ts';
export { DeleteGameEndpoint } from './Endpoints/Games/DeleteGameEndpoint.ts';


export { Database } from './db/Database.ts';
export type { User } from './db/models/UserModel.ts';
export type { Game } from './db/models/GameModel.ts';
export type { GameFull } from './db/models/GameFullModel.ts';
 
export { MySqlRepository } from './Repositories/MySqlRepository.ts';

export { GameController } from './Controllers/GameController.ts';
export { AuthenticationController } from './Controllers/AuthenticationController.ts';
export { ImageController } from './Controllers/ImageController.ts';

export { ValidationError, AuthenticationError, ForeignKeyError } from './Shared/Errors.ts';

export { staticFileMiddleware } from './Middleware/staticFileMiddleware.ts';