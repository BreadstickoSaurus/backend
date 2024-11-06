import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GenreController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetGenresEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new GenreController();
            const genres = await controller.getGenres();

            context.response.status = 200;
            context.response.body = { genres };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}