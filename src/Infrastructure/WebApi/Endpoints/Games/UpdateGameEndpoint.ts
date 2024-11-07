import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { ForeignKeyError, GameController, ValidationError, type Endpoint, type Game } from '../../mod.ts';
import { number, z } from '@zod';

export class UpdateGameEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly updateGameSchema = z.object({
        title: z.string().min(1),
        description: z.string(),
        releaseDate: z.preprocess((arg) => {
            if (typeof arg === 'string') {
                const date = new Date(arg);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            return undefined;
        }, z.date(),
        ),
        stateId: z.number().int(),
        platformId: z.number().int(),
        ReleaseCountryCode: z.string().length(2),
        publisherID: z.number().int(),
        developerID: z.number().int(),
        genreId: z.number().int(),
        altTitles: z.array(z.string()).optional()
    });
    
    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const gameId = context.params.gameId;
            const data = await context.request.body.json();

            validateRequest(data, this.updateGameSchema, this._errorsBag);

            if(this._errorsBag.hasErrors()){
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }   

            const controller = new GameController();

            const collectionId = await controller.getCollectionId(parseInt(gameId));
            const wishlisted = await controller.getWishlistValue(parseInt(gameId));

            const mappedData = this.mapData(data, collectionId, wishlisted);

            const updatedGameId = await controller.updateGame(parseInt(gameId), mappedData);
            await controller.updateAltTitles(parseInt(gameId), data.altTitles);

            context.response.status = 200;
            context.response.body = { updatedGameId };

        }catch(error){
            if(error instanceof ValidationError){
                context.response.status = 400;
                context.response.body = { error: "Error during update of game", details: error.message };
            }else if(error instanceof ForeignKeyError){
                context.response.status = 400;
                context.response.body = { error: "One of the given id's does not exist", details: error.message };

            }else{
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
    mapData(data: any, colId: number, wishl: number): Game {
        return {
            title: data.title,
            description: data.description,
            releaseDate: data.releaseDate,
            collectionId: colId,
            wishlisted: wishl,
            stateId: data.stateId,
            platformId: data.platformId,
            ReleaseCountryCode: data.ReleaseCountryCode,
            publisherID: data.publisherID,
            developerID: data.developerID,
            genreId: data.genreId,
        }
    }
}