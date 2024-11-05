import { RouterContext } from '@oak/oak';
import { ErrorsBag } from '../../Shared/mod.ts';
import { AuthenticationError, GetGameDetailsController, ValidationError, type Endpoint } from '../mod.ts';

export class GetGameDetailsEndpoint implements Endpoint {
    private readonly _errosBag = new ErrorsBag();
    
    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;

            const controller = new GetGameDetailsController();
            const game = await controller.getGameDetails(parseInt(gameId));

            context.response.status = 200;
            context.response.body = game;


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