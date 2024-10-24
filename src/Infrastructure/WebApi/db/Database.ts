import { Client } from "@mysql";
import { config } from "@dotenv";


export class Database {
    private client: Client;

    constructor() {
        this.client = new Client();
    }

    async connect() {
        const env = config(); // Load environment variables from .env file

        await this.client.connect({
            hostname: env.DB_HOST,
            username: env.DB_USER, 
            db: env.DB_NAME,       
            password: env.DB_PASSWORD,
            port: parseInt(env.DB_PORT),
        });

        console.log("Connected to the MySQL database!");
    }

    async close() {
        await this.client.close();
        console.log("Disconnected from the MySQL database.");
    }

    getClient(): Client {
        return this.client; // Expose the client for use in other operations
    }
}