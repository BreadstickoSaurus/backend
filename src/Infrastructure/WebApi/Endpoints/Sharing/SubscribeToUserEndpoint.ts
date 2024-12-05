import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { GameController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class SubscribeToUserEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const userId = parseInt(context.params.userId);

            const controller = new GameController();
            const result = await controller.subscribeToUser(userId);

            if(result === null) {
                context.response.status = 403;
                context.response.body = { error: "User collection is private" };
                return;
            }

            context.response.status = 200;
            context.response.body = { message: "User collection is public" };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error subscribing to user", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: (error as Error).message };
            }
        }
    }
}