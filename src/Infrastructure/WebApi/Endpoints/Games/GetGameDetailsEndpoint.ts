import { RouterContext } from '@oak/oak';
import { ErrorsBag } from '../../../Shared/mod.ts';
import { AuthenticationError, GameController, ValidationError, type Endpoint } from '../../mod.ts';

export class GetGameDetailsEndpoint implements Endpoint {
    private readonly _errosBag = new ErrorsBag();
    
    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;

            const controller = new GameController();
            const game = await controller.getGameDetails(parseInt(gameId));

            const gameOutput = {
                ...game,
                releaseDate: game.releaseDate.toISOString().split('T')[0] // Only date part for JSON output
            };

            context.response.status = 200;
            context.response.body = gameOutput;


        }catch(error){
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Game not found"};
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}