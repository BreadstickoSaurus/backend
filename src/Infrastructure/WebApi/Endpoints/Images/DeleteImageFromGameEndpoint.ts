import { z } from '@zod';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { ImageController, ValidationError, type Endpoint } from '../../mod.ts';
import type { RouterContext } from '@oak/oak';


export class DeleteImageFromGameEndpoint implements Endpoint{
    private readonly _errorsBag = new ErrorsBag();

    private readonly deleteImageFromGameSchema = z.object({
        imageUrl: z.string().min(1),
    });


    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;
            const body = await context.request.body.json();

            validateRequest(body, this.deleteImageFromGameSchema, this._errorsBag);

            if(this._errorsBag.hasErrors()){
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }
            
            const controller = new ImageController();
            await controller.DeleteImage(parseInt(gameId), body.imageUrl);

            context.response.status = 200;
            context.response.body = { 
                success: true,
                message: "Image successfully deleted"
            };
        }catch(error){
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}