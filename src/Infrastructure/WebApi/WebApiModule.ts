import { Application } from '@oak/oak/application';
import { oakCors } from '@tajpouria/cors';
import { Module } from '../Shared/mod.ts';
import { endpoints, staticFileMiddleware } from './mod.ts';

export class WebApiModule implements Module {
    private readonly _port: number;

    constructor(port: number) {
        this._port = port;
    }

    run(): Promise<void> {
        console.log(`WebApi running on port http://127.0.0.1:${this._port}/api`);
        
        const app = new Application();

        app.use(oakCors(
            {
                origin: '*',
                optionsSuccessStatus: 200,
                methods: ['*'],
                allowedHeaders: ['*'],
                exposedHeaders: ['*'],
            },
        ));

        app.use(staticFileMiddleware("/uploads", `${Deno.cwd()}/images`));


        const router = endpoints();

        app.use(router.prefix("/api").routes());
        app.use(router.allowedMethods());

        return app.listen({ port: this._port });
    }
}
