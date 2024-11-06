import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { DeveloperController, ValidationError, type Developer, type Endpoint } from '../../mod.ts';
import { z } from '@zod';

export class AddDeveloperEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly addDeveloperSchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        countryCode: z.string().length(2)
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const data = await context.request.body.json();

            validateRequest(data, this.addDeveloperSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new DeveloperController();
            const developerId = await controller.addDeveloper(this.mapData(data));

            context.response.status = 201;
            context.response.body = { developerId };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error adding developer", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }

    private mapData(data: any): Developer {
        return {
            developer_id: data.id,
            developer_name: data.name,
            developer_description: data.description,
            country_code: data.countryCode
        };
    }
}