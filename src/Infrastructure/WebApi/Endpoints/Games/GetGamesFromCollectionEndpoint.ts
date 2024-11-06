import { RouterContext } from '@oak/oak';
import { ValidationError,GameController, type Endpoint, AuthenticationError } from '../../mod.ts';
import { ErrorsBag } from '../../../Shared/mod.ts';

export class GetGamesFromCollectionEndpoint implements Endpoint {
    private readonly _errosBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const userId = context.params.userId;

            const controller = new GameController();
            const games = await controller.getGamesFromCollection(parseInt(userId));

            context.response.status = 200;
            context.response.body = games;

        }catch(error) {
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Game not found in collection"};
            }else if(error instanceof AuthenticationError){
                context.response.status = 401;
                context.response.body = { error: "User collection not found" };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}