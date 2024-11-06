import { ErrorsBag } from '../../../Shared/mod.ts';
import { ImageController, ValidationError, type Endpoint } from '../../mod.ts';
import type { RouterContext } from '@oak/oak';


export class getImageUrlsFromGame implements Endpoint{
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;
            
            const controller = new ImageController();
            const imageUrls = await controller.getImageUrls(parseInt(gameId));  

            context.response.status = 200;
            context.response.body = { 
                gameId,
                imageUrls
            };
        }catch(error){
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Error retrieving image urls", details: error.message };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}