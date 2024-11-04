import { Database, User, Game, ForeignKeyError } from "../mod.ts";
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

    async getCollectionId(userId: number): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT collection_id FROM collections WHERE user_id = ?',
                [userId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError("Collection not found");
            }

            return result.rows[0].collection_id;
        } catch (error) {
            console.error("Error in getCollectionId:", error);
            throw new Error("Database error");
        }
    }

    async addGameToCol(data: Game): Promise<number> {
        try {
            let wishlisted = 0;
            if(data.wishlisted){
                wishlisted = 1;
            }
            const result = await this.db.getClient().execute(
                'INSERT INTO games (game_title, game_description, release_date, state_id, platform_id, release_country_code, publisher_id, developer_id, genre_id, collection_id, wishlisted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [data.title, data.description, data.releaseDate, data.stateId, data.platformId, data.ReleaseCountryCode, data.publisherID, data.developerID, data.genreId, data.collectionId, wishlisted]
            );

            if (result.affectedRows === 0) {
                throw new ForeignKeyError('Could not add game');
            }

            const gameId = result.lastInsertId;
            if (gameId === undefined) {
                throw new Error('Failed to retrieve user ID');
            }
            return gameId;

        } catch (error) {
            console.error("Error in addGameToCol:", error);
            if ((error as Error).message.includes('Cannot add or update a child row: a foreign key constraint fails')) {
                throw new ForeignKeyError("ForeignKey error"); // Throw custom error
            }
            if(error instanceof ForeignKeyError) throw error;
            throw new Error("Database error");
        }
    }

    async getGamesFromCol(userId: number) : Promise<Game[]> {
        try {
            const collectionId = await this.getCollectionId(userId);

            const result = await this.db.getClient().execute(
                'SELECT * FROM games WHERE collection_id = ? AND wishlisted = 0',
                [collectionId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError("No games found in collection");
            }

            return result.rows as Game[];
        } catch (error) {
            console.error("Error in getGamesFromCol:", error);
            if (error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }
}