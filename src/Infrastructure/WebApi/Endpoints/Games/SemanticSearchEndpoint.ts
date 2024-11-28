import { RouterContext } from '@oak/oak';
import { ErrorsBag } from '../../../Shared/mod.ts';
import { GameController, ValidationError, type Endpoint } from '../../mod.ts';

export class SemanticSearchEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            // // Extract search query from the request body
            // const data = await context.request.body.json();
            
            // validateRequest(data, this.searchSchema, this._errorsBag);

            // if(this._errorsBag.hasErrors()){
            //     context.response.status = 400;
            //     context.response.body = { errors: this._errorsBag.getErrors() };
            //     return;
            // }   
            // const query:string = data.query;
            const query = context.request.url.searchParams.get('q');

            const controller = new GameController();
            const result = await controller.getGamesUsingSemanticSearch(query || "");

            context.response.status = 200;
            context.response.body = result;
        } catch (error) {
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: error.message };
            }else{
                console.error("Error in search endpoint:", error);
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}
