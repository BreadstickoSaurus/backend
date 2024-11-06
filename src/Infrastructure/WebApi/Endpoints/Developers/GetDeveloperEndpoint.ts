import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { DeveloperController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetDeveloperEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const developerId = context.params.developerId;
            const controller = new DeveloperController();
            const developer = await controller.getDeveloper(parseInt(developerId));

            context.response.status = 200;
            context.response.body = { developer };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}