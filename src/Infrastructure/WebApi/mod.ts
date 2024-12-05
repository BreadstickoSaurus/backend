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
export { AddAltTitlesToGameEndpoint } from './Endpoints/AltTitles/AddAltTitlesToGameEndpoint.ts';
export { DeleteAltTitlesFromGameEndpoint } from './Endpoints/AltTitles/DeleteAltTitlesFromGameEndpoint.ts';

export { GetPlatformsEndpoint } from './Endpoints/Platforms/GetPlatformsEndpoint.ts';
export { AddPlatformEndpoint } from './Endpoints/Platforms/AddPlatformEndpoint.ts';
export { GetPlatformEndpoint } from './Endpoints/Platforms/GetPlatformEndpoint.ts';
export { DeletePlatformEndpoint } from './Endpoints/Platforms/DeletePlatformEndpoint.ts';

export { GetPublishersEndpoint } from './Endpoints/Publishers/GetPublishersEndpoint.ts';
export { AddPublisherEndpoint } from './Endpoints/Publishers/AddPublisherEndpoint.ts';
export { DeletePublisherEndpoint } from './Endpoints/Publishers/DeletePublisherEndpoint.ts';
export { GetPublisherEndpoint } from './Endpoints/Publishers/GetPublisherEndpoint.ts';

export { GetDevelopersEndpoint } from './Endpoints/Developers/GetDevelopersEndpoint.ts';
export { GetDeveloperEndpoint } from './Endpoints/Developers/GetDeveloperEndpoint.ts';
export { DeleteDeveloperEndpoint } from './Endpoints/Developers/DeleteDeveloperEndpoint.ts';
export { AddDeveloperEndpoint } from './Endpoints/Developers/AddDeveloperEndpoint.ts';

export { GetGenresEndpoint } from './Endpoints/Genres/GetGenresEndpoint.ts';
export { GetGenreEndpoint } from './Endpoints/Genres/GetGenreEndpoint.ts';
export { DeleteGenreEndpoint } from './Endpoints/Genres/DeleteGenreEndpoint.ts';
export { AddGenreEndpoint } from './Endpoints/Genres/AddGenreEndpoint.ts';

export { GetStatesEndpoint } from './Endpoints/States/GetStatesEndpoint.ts';
export { GetCountriesEndpoint } from './Endpoints/Countries/GetCountriesEndpoint.ts';

export { SemanticSearchEndpoint } from './Endpoints/Games/SemanticSearchEndpoint.ts';
export { SearchEndpoint } from './Endpoints/Games/SearchEndpoint.ts';

export { SetCollectionStateEndpoint } from './Endpoints/Sharing/SetCollectionStateEndpoint.ts';
export { SubscribeToUserEndpoint } from './Endpoints/Sharing/SubscribeToUserEndpoint.ts';


export { Database } from './db/Database.ts';
export type { User } from './db/models/UserModel.ts';
export type { Game } from './db/models/GameModel.ts';
export type { GameFull } from './db/models/GameFullModel.ts';
export type { Platform } from './db/models/PlatformModel.ts';
export type { Publisher } from './db/models/PublisherModel.ts';
export type { Developer } from './db/models/DeveloperModel.ts';
export type { Genre } from './db/models/GenreModel.ts';
export type { State } from './db/models/StateModel.ts';
export type { Country } from './db/models/CountryModel.ts';
 
export { MySqlRepository } from './Repositories/MySqlRepository.ts';

export { GameController } from './Controllers/GameController.ts';
export { AuthenticationController } from './Controllers/AuthenticationController.ts';
export { ImageController } from './Controllers/ImageController.ts';
export { PlatformController } from './Controllers/PlatformController.ts';
export { PublisherController } from './Controllers/PublisherController.ts';
export { DeveloperController } from './Controllers/DeveloperController.ts';
export { GenreController } from './Controllers/GenreController.ts';
export { StateController } from './Controllers/StateController.ts';
export { CountryController } from './Controllers/CountryController.ts';
export { AltTitleController } from './Controllers/AltTitleController.ts';

export { ValidationError, AuthenticationError, ForeignKeyError } from './Shared/Errors.ts';

export { staticFileMiddleware } from './Middleware/staticFileMiddleware.ts';