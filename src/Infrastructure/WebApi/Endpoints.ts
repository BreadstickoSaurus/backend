import { Router, RouterContext } from '@oak/oak';
import { 
    RootEndpoint, 
    RegisterEndpoint, 
    Endpoint, 
    LoginEndpoint, 
    AddGameToColEndpoint, 
    AddGameToWishlistEndpoint, 
    GetGamesFromCollectionEndpoint, 
    GetGamesFromWishlistEndpoint, 
    GetGameDetailsEndpoint,
    UpdateGameEndpoint,
    AddImageToGameEndpoint,
    getImageUrlsFromGame,
    DeleteImageFromGameEndpoint,
    DeleteGameEndpoint,
    AddPlatformEndpoint,
    DeletePlatformEndpoint,
    GetPlatformEndpoint,
    GetPlatformsEndpoint,
    AddPublisherEndpoint,
    DeletePublisherEndpoint,
    GetPublisherEndpoint,
    GetPublishersEndpoint
} from './mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}


export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new RootEndpoint()));
    router.post('/register', use(new RegisterEndpoint()));
    router.post('/login', use(new LoginEndpoint()));

    router.post('/game/collection/:userId', use(new AddGameToColEndpoint()));
    router.post('/game/wishlist/:userId', use(new AddGameToWishlistEndpoint()));
    router.get('/game/collection/:userId', use(new GetGamesFromCollectionEndpoint))
    router.get('/game/wishlist/:userId', use(new GetGamesFromWishlistEndpoint))
    router.get('/game/:gameId', use(new GetGameDetailsEndpoint()));
    router.put('/game/:gameId', use(new UpdateGameEndpoint()));
    router.delete('/game/:gameId', use(new DeleteGameEndpoint()));

    router.post('/game/:gameId/images', use(new AddImageToGameEndpoint()));
    router.get('/game/:gameId/images', use(new getImageUrlsFromGame()));
    router.delete('/game/:gameId/images', use(new DeleteImageFromGameEndpoint()));

    router.get('/platforms', use(new GetPlatformsEndpoint()));
    router.post('/platforms', use(new AddPlatformEndpoint()));
    router.get('/platforms/:platformId', use(new GetPlatformEndpoint()));
    router.delete('/platforms/:platformId', use(new DeletePlatformEndpoint()));

    router.get('/publishers', use(new GetPublishersEndpoint()));
    router.post('/publishers', use(new AddPublisherEndpoint()));
    router.get('/publishers/:publisherId', use(new GetPublisherEndpoint()));
    router.delete('/publishers/:publisherId', use(new DeletePublisherEndpoint()));


    //getAllWishlistedGames | semantic search

    //,publisher,developer,genre
    //get,post,delete

    //getState






    //filter very precies, semantic search only name, appachesolr
    //final fantasy dummy data
    //reverse 2dehands



    return router;
}