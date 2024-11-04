import { RouterContext } from '@oak/oak';
import { ForeignKeyError, GetGamesFromCollectionController, type Endpoint } from '../mod.ts';
import { ErrorsBag } from '../../Shared/mod.ts';

export class GetGamesFromCollectionEndpoint implements Endpoint {
    private readonly _errosBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const userId = context.params.userId;

            const controller = new GetGamesFromCollectionController();
            const games = await controller.getGamesFromCollection(parseInt(userId));

            context.response.status = 200;
            context.response.body = games;

        }catch(error) {
            if(error instanceof ForeignKeyError){
                context.response.status = 400;
                context.response.body = { error: "check your id('s)", details: error.message };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}