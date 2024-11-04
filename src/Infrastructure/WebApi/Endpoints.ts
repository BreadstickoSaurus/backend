import { Router, RouterContext } from '@oak/oak';
import { RootEndpoint, RegisterEndpoint, Endpoint, LoginEndpoint } from './mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}


export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new RootEndpoint()));
    router.post('/register', use(new RegisterEndpoint()));
    router.post('/login', use(new LoginEndpoint()));

    //addGameToCollection : userID
    //addGameToWishlist : userID
    
    //getGamesFromCollection : userID
    //getGamesFromWishlist : userID

    //getGameDetails : gameID
    //getGameImages : gameID

    //updateGame : gameID
    //deleteGame : gameID

    //getAllWishlistedGames | semantic search


    //filter very precies, semantic search only name, appachesolr
    //final fantasy dummy data
    //reverse 2dehands



    return router;
}