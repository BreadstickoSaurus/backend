import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PlatformController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetPlatformEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const platformId = context.params.platformId;

            const controller = new PlatformController();
            const platform = await controller.getPlatform(parseInt(platformId));

            context.response.status = 200;
            context.response.body = { platform };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}