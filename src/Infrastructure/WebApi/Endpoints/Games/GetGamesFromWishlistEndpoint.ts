import { RouterContext } from '@oak/oak';
import { ValidationError,GameController, type Endpoint, AuthenticationError } from '../../mod.ts';
import { ErrorsBag } from '../../../Shared/mod.ts';

export class GetGamesFromWishlistEndpoint implements Endpoint {
    private readonly _errosBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const userId = context.params.userId;

            const controller = new GameController();
            const games = await controller.getGameFromWishlist(parseInt(userId));

            context.response.status = 200;
            context.response.body = games.map((game) => ({
                ...(game as any), // Cast to 'any' to avoid strict type enforcement
                release_date: game.release_date.toISOString().split('T')[0] // Format releaseDate as a date-only string
            }));

        }catch(error) {
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Wishlist not found" };
            }else if(error instanceof AuthenticationError){
                context.response.status = 401;
                context.response.body = { error: "User wishlist not found" };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}