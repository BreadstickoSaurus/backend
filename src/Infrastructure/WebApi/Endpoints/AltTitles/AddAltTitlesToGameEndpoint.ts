import { z } from '@zod';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { AltTitleController, ValidationError, type Endpoint } from '../../mod.ts';
import type { RouterContext } from '@oak/oak';


export class AddAltTitlesToGameEndpoint implements Endpoint{
    private readonly _errorsBag = new ErrorsBag();
    private readonly addAltTitleToGameSchema = z.object({
        altTitles: z.array(z.string())
    });
    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;      
            const data = await context.request.body.json();

            validateRequest(data, this.addAltTitleToGameSchema, this._errorsBag);

            if(this._errorsBag.hasErrors()){
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }   

            const controller = new AltTitleController();
            controller.addAltTitlesToGame(parseInt(gameId), data.altTitles);

            context.response.status = 200;
            context.response.body = { 
                gameId,
                "message": "Alt titles successfully added to game"
            };
        }catch(error){
            if(error instanceof Error){
                context.response.status = 400;
                context.response.body = { error: "Error during adding of alt titles to game", details: error.message };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}