import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GenreController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetGenreEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const genreId = context.params.genreId;
            const controller = new GenreController();
            const genre = await controller.getGenre(parseInt(genreId));

            context.response.status = 200;
            context.response.body = { genre };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}