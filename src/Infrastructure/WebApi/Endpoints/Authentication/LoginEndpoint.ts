import { RouterContext } from '@oak/oak';
import { z } from '@zod';
import { Endpoint } from '../../mod.ts';
import { AuthenticationController } from '../../mod.ts';
import { ErrorsBag } from '../../../Shared/mod.ts';
import { validateRequest } from '../../../Shared/mod.ts';
import { AuthenticationError, ValidationError } from '../../mod.ts';

export class LoginEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    private readonly loginSchema = z.object({
        name: z.string().min(1),
        password: z.string().min(1),
    });

    async handle(context: RouterContext<string>): Promise<void> {
        try{
            const data = await context.request.body.json();   

            validateRequest(data, this.loginSchema, this._errorsBag);

            if (this._errorsBag.hasErrors()) {
                context.response.status = 400;
                context.response.body = { errors: this._errorsBag.getErrors() };
                return;
            }

            const controller = new AuthenticationController();

            const result = await controller.loginUser(data.name, data.password);

            context.response.status = 201;
            context.response.body = {
                success: true,
                message: "User successfully logged in",
                id: result,
            };

        }catch (error) {
            if (error instanceof AuthenticationError) {
                context.response.status = 401;
                context.response.body = { error: "Invalid credentials" };
            } else if (error instanceof ValidationError) {
                context.response.status = 400;
                context.response.body = { error: "Validation failed", details: error.message };
            } else {
                context.response.status = 500;
                context.response.body = { error: "Internal server error" };
            }
        }
    }
}
