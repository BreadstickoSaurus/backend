import { RouterContext } from '@oak/oak';
import { GameController, type Endpoint, ForeignKeyError, Game } from '../../mod.ts';
import { ErrorsBag } from '../../../Shared/mod.ts';
import { validateRequest } from '../../../Shared/mod.ts';
import { z } from '@zod';


export class AddGameToWishlistEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly addGameToWLSchema = z.object({
        title: z.string().min(1),
        description: z.string(),
        releaseDate: z.preprocess((arg) => {
            if (typeof arg === 'string') {
                const date = new Date(arg);
                if (!isNaN(date.getTime())) { // Check if date is valid
                    return date;
                }
            }
            return undefined; // Return undefined if conversion fails
        }, z.date(), // This ensures that it is still a Date after processing
        ),
        stateId: z.number().int(),
        platformId: z.number().int(),
        ReleaseCountryCode: z.string().length(2),
        publisherID: z.number().int(),
        developerID: z.number().int(),
        genreId: z.number().int(),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const userId = context.params.userId;
            const data = await context.request.body.json();

            validateRequest(data, this.addGameToWLSchema, this._errorsBag);

            if(this._errorsBag.hasErrors()){
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }            

            const controller = new GameController();
            const gameData = this.mapData(data);

            const gameId = await controller.addGameToCol(parseInt(userId), gameData);

            context.response.status = 201;
            context.response.body = {
                success: true,
                message: "Game successfully added to collection",
                gameId: gameId,
            };

        }catch (error) {
            if(error instanceof ForeignKeyError){
                context.response.status = 400;
                context.response.body = { error: "One of the id's does noet exist", details: error.message };
            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }

    mapData(data: any): Game {
        return {
            game_title: data.title,
            game_description: data.description,
            releaseDate: data.releaseDate,
            collectionId: 0,
            wishlisted: 1,
            stateId: data.stateId,
            platformId: data.platformId,
            ReleaseCountryCode: data.ReleaseCountryCode,
            publisherID: data.publisherID,
            developerID: data.developerID,
            genreId: data.genreId,
        }
    }

}