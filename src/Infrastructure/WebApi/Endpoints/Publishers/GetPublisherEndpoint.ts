import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PublisherController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetPublisherEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const publisherId = context.params.publisherId;

            const controller = new PublisherController();
            const publisher = await controller.getPublisher(parseInt(publisherId));

            context.response.status = 200;
            context.response.body = { publisher };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}