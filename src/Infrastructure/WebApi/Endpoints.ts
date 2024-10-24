import { Router, RouterContext } from '@oak/oak';
import { RootEndpoint, RegisterEndpoint, Endpoint } from './mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}


export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new RootEndpoint()));
    router.post('/register', use(new RegisterEndpoint()));
    //login
    //register - create coll and wish
    // - user ID

    //addGameToCollection : userID
    //addGameToWishlist : userID


    //(all games from user via collectionid then userid wel of niet wishlisted)
    //addImageToGame
    //removeImageFromGame
    //updateGame
    //getGames : id
    //getGameDetails : id

    //getAllWishlistedGames | semantic search


    //filter very precies, semantic search only name, appachesolr
    //final fantasy dummy data
    //reverse 2dehands



    return router;
}