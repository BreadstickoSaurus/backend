import { ErrorsBag } from '../../../Shared/mod.ts';
import { ImageController, ValidationError, type Endpoint } from '../../mod.ts';
import type { RouterContext } from '@oak/oak';


export class AddImageToGameEndpoint implements Endpoint{
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;
            
            if (!context.request.hasBody) {
                context.response.status = 400;
                context.response.body = { message: "No files uploaded." };
                return;
            }           

            const body = await context.request.body.formData();

            const controller = new ImageController();
            const imageUrls: string[] = [];
            for await (const [name, value] of body.entries()) {
                if (value instanceof File) {
                    const url = await controller.storeImage(value);
                    imageUrls.push(url);
                }
            }

            await controller.saveImageUrls(parseInt(gameId), imageUrls);

            context.response.status = 200;
            context.response.body = { 
                gameId,
                imageUrls
            };
        }catch(error){
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Error during adding image to game", details: error.message };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}