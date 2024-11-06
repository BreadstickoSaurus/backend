import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PublisherController, ValidationError, type Endpoint, type Publisher } from '../../mod.ts';
import { z } from '@zod';


export class AddPublisherEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly addPublisherSchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        countryCode: z.string().length(2),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const data = await context.request.body.json();

            validateRequest(data, this.addPublisherSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new PublisherController();
            const publisherId = await controller.addPublisher(this.mapData(data));

            context.response.status = 201;
            context.response.body = { publisherId };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error adding publisher", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }

    private mapData(data: any): Publisher {
        return {
            publisher_name: data.name,
            publisher_description: data?.description,
            country_code: data.countryCode,
        };
    }
}