import { Database, User } from "../mod.ts";
import { AuthenticationError, ValidationError } from "../mod.ts";

export class MySqlRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db; // Store the database instance
    }

    async registerUser(user: User): Promise<void> {

        try{
            const result = await this.db.getClient().execute(
                'INSERT INTO users (username, password) VALUES (?, ?)', 
                [user.name, user.password]
            );
    
            if (result.affectedRows === 0) {
                throw new ValidationError('Username is already in use');
            }
            const userID = result.lastInsertId;

            if (userID === undefined) {
                throw new Error('Failed to retrieve user ID');
            }

            await this.addCollection(userID);

        }catch(error){
            console.error('Error in registerUser:', error);
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError('Username is already in use');
            }
            throw new Error('Database error');
        }
    }

    async loginUser(user: User): Promise<number>{
        try{
            const result = await this.db.getClient().execute(
                'SELECT * FROM users WHERE username = ? AND password = ?', 
                [user.name, user.password]
            );
    
            if (!result.rows || result.rows.length === 0) {
                throw new AuthenticationError("User not found");
            }
            const userId = result.rows[0].user_id;
            return userId;

        }catch(error){
            console.error('Error in loginUser:', error);
            if (error instanceof AuthenticationError) throw error;
            throw new Error('Database error');
        }
    }

    private async addCollection(userId: number): Promise<void> {
        try {
            const result = await this.db.getClient().execute(
                'INSERT INTO collections (user_id) VALUES (?)',
                [userId]
            );
    
            if (result.affectedRows === 0) {
                throw new ValidationError("Could not add collection");
            }
        } catch (error) {
            console.error("Error in addCollection:", error);
            
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError("A collection already exists for this user");
            }

            throw new Error("Database error");
        }
    }
}