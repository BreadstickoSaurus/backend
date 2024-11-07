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

export class GetStateEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        try {
            const stateId = context.params.stateId;
            const controller = new StateController();
            const state = await controller.getState(parseInt(stateId));

            if (!state) {
                context.response.status = 404;
                context.response.body = { error: "State not found" };
                return;
            }

            context.response.status = 200;
            context.response.body = { state };
        } catch (error) {
            context.response.status = 500;
            context.response.body = { error: "Internal server error" };
        }
    }
}