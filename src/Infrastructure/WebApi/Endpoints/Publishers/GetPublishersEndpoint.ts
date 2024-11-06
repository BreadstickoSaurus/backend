import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PublisherController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetPublishersEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new PublisherController();
            const publishers = await controller.getPublishers();

            context.response.status = 200;
            context.response.body = { publishers };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}