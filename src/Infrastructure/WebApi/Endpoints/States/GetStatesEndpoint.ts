import { RouterContext } from '@oak/oak';
import { StateController, ValidationError, type Endpoint } from '../../mod.ts';

export class GetStatesEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const controller = new StateController();
            const states = await controller.getStates();

            context.response.status = 200;
            context.response.body = { states };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}