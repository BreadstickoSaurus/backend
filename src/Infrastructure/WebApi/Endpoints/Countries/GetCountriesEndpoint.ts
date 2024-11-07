import { RouterContext } from '@oak/oak';
import { CountryController, ValidationError, type Endpoint } from '../../mod.ts';

export class GetCountriesEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new CountryController();
            const countries = await controller.getCountries();

            context.response.status = 200;
            context.response.body = { countries };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}