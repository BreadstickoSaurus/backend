import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GenreController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class DeleteGenreEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const genreId = context.params.genreId;

            const controller = new GenreController();
            await controller.deleteGenre(parseInt(genreId));

            context.response.status = 200;
            context.response.body = { message: "Genre deleted successfully" };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error deleting genre", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}