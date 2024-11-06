import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PlatformController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class DeletePlatformEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const platformId = context.params.platformId;

            const controller = new PlatformController();
            await controller.deletePlatform(parseInt(platformId));

            context.response.status = 200;
            context.response.body = { message: "Platform deleted successfully" };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error deleting platform", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}