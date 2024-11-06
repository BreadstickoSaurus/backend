import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GenreController, ValidationError, type Endpoint, type Genre } from '../../mod.ts';
import { z } from '@zod';

export class AddGenreEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly addGenreSchema = z.object({
        name: z.string().min(1),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const data = await context.request.body.json();

            validateRequest(data, this.addGenreSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new GenreController();
            const genreId = await controller.addGenre(this.mapData(data));

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

    private mapData(data: any): Genre {
        return {
            genre_name: data.name,
        };
    }
}