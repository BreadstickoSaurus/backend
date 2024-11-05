import { Context, send, Middleware } from "@oak/oak";

/**
 * Middleware to serve static files from the specified directory.
 * 
 * @param staticPath - The base URL path for accessing static files (e.g., '/uploads')
 * @param rootDir - The directory where static files are stored (e.g., './images')
 */
export function staticFileMiddleware(staticPath: string, rootDir: string): Middleware {
    return async (context: Context<Record<string, unknown>, Record<string, unknown>>, next) => {
        if (context.request.url.pathname.startsWith(staticPath)) {
            const filePath = context.request.url.pathname.replace(staticPath, "");
            await send(context, filePath, {
                root: rootDir,
            });
        } else {
            await next();
        }
    };
}
