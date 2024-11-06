import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PublisherController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class DeletePublisherEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const publisherId = context.params.publisherId;

            const controller = new PublisherController();
            await controller.deletePublisher(parseInt(publisherId));

            context.response.status = 200;
            context.response.body = { message: "Publisher deleted successfully" };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error deleting publisher", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}