import { RouterContext } from '@oak/oak';
import { ErrorsBag, validateRequest } from '../../../Shared/mod.ts';
import { PlatformController, ValidationError, type Endpoint, type Platform } from '../../mod.ts';
import { z } from '@zod';

export class AddPlatformEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly addPlatformSchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        releaseDate: z.preprocess((arg) => {
            if (typeof arg === 'string') {
                const date = new Date(arg);
                if (!isNaN(date.getTime())) { // Check if date is valid
                    return date;
                }
            }
            return undefined; // Return undefined if conversion fails
        }, z.date(), // This ensures that it is still a Date after processing
        ),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const data = await context.request.body.json();

            validateRequest(data, this.addPlatformSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new PlatformController();
            const platformId = await controller.addPlatform(this.mapData(data));

            context.response.status = 201;
            context.response.body = { platformId };
        } catch (error) {
            if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Error adding platform", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }

    private mapData(data: any): Platform {
        return {
            platform_name: data.name,
            platform_description: data?.description,
            release_date: data.releaseDate,
        };
    }
}