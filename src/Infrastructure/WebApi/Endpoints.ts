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
    DeleteImageFromGame
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

    router.post('/game/:gameId/images', use(new AddImageToGameEndpoint()));
    router.get('/game/:gameId/images', use(new getImageUrlsFromGame()));
    router.delete('/game/:gameId/images', use(new DeleteImageFromGame()));


    //deleteGame : gameID

    //getAllWishlistedGames | semantic search

    //platofrm,publisher,developer,genre
    //get,post,delete

    //getState






    //filter very precies, semantic search only name, appachesolr
    //final fantasy dummy data
    //reverse 2dehands



    return router;
}