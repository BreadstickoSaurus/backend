import { Router, RouterContext } from '@oak/oak';
import { RootEndpoint, RegisterEndpoint, Endpoint, LoginEndpoint, AddGameToColEndpoint, AddGameToWishlistEndpoint, GetGamesFromCollectionEndpoint } from './mod.ts';

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
    
    //getGamesFromCollection : userID
    router.get('/game/collection/:userId', use(new GetGamesFromCollectionEndpoint))
    //getGamesFromWishlist : userID

    //getGameDetails : gameID
    //getGameImages : gameID

    //updateGame : gameID
    //deleteGame : gameID

    //getAllWishlistedGames | semantic search

    //state,platofrm,publisher,developer,genre
    //crud operations on all of them






    //filter very precies, semantic search only name, appachesolr
    //final fantasy dummy data
    //reverse 2dehands



    return router;
}