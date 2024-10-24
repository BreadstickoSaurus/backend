import { Database, User } from "../mod.ts";

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
                throw new Error('Failed to insert user');
            }
        }catch(error){
            console.error('Error in registerUser:', error);
            throw new Error('Failed to insert user');
        }
    }
}