import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PlatformController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetPlatformsEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new PlatformController();
            const platforms = await controller.getPlatforms();

            context.response.status = 200;
            context.response.body = { platforms };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}