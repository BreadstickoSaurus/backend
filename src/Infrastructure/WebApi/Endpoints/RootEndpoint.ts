import { RouterContext } from '@oak/oak';
import { Endpoint } from '../mod.ts';

export class RootEndpoint implements Endpoint {
    handle(context: RouterContext<string>): Promise<void> {
        context.response.body = 'Hello World!';

        return Promise.resolve();
    }
}

