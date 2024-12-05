import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GameController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class SetCollectionStateEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly setCollectionSateSchema = z.object({
        collectionId: z.number(),
        state: z.boolean(),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const data = await context.request.body.json();

            validateRequest(data, this.setCollectionSateSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new GameController();
            const genreId = await controller.setCollectionState(data.collectionId, data.state);

            context.response.status = 201;
            context.response.body = { genreId };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error adding genre", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}