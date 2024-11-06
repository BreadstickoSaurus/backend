import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { DeveloperController, ValidationError, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class GetDevelopersEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new DeveloperController();
            const developers = await controller.getDevelopers();

            context.response.status = 200;
            context.response.body = { developers };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}