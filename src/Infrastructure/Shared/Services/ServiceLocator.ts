export class ServiceLocator {
    private static services: { [key: string]: any } = {};

    static register<T>(key: string, service: T): void {
        this.services[key] = service;
    }

    static get<T>(key: string): T {
        const service = this.services[key];
        if (!service) {
            throw new Error(`Service not found: ${key}`);
        }
        return service;
    }
}
