import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { DeveloperController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class DeleteDeveloperEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const developerId = context.params.developerId;

            const controller = new DeveloperController();
            await controller.deleteDeveloper(parseInt(developerId));

            context.response.status = 200;
            context.response.body = { message: "Developer deleted successfully" };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error deleting developer", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}