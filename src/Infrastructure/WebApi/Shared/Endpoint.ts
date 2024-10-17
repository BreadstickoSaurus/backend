import { RouterContext } from '@oak/oak';

export interface Endpoint {
    handle(context: RouterContext<string>): Promise<void>;
}
