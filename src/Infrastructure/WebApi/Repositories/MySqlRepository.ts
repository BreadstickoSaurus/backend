import type { GameFull } from '../db/models/GameFullModel.ts';
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

    async getCollectionIdByGameId(gameId: number): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT collection_id FROM games WHERE game_id = ?',
                [gameId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError("Collection not found");
            }

            return result.rows[0].collection_id;
        } catch (error) {
            console.error("Error in getCollectionIdByGameId:", error);
            throw new Error("Database error");
        }
    }

    async getWishlistValue(gameId: number): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT wishlisted FROM games WHERE game_id = ?',
                [gameId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError("Game not found");
            }

            return result.rows[0].wishlisted;
        } catch (error) {
            console.error("Error in getWishlistValue:", error);
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

            if (!result.rows) {
                throw new AuthenticationError("User collection not found");
            }
            if(result.rows.length === 0){
                throw new ValidationError("No games found in collection");
            }

            return result.rows as Game[];
        } catch (error) {
            console.error("Error in getGamesFromCol:", error);
            if (error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getGamesFromWishlist(userId: number) : Promise<Game[]> {
        try {
            const collectionId = await this.getCollectionId(userId);

            const result = await this.db.getClient().execute(
                'SELECT * FROM games WHERE collection_id = ? AND wishlisted = 1',
                [collectionId]
            );

            if (!result.rows) {
                throw new AuthenticationError("User wishlist not found");
            }
            if(result.rows.length === 0){
                throw new ValidationError("No games found in wishlist");
            }

            return result.rows as Game[];
        } catch (error) {
            console.error("Error in getGamesFromWishlist:", error);
            if (error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getGameDetails(gameId: number): Promise<GameFull> {
        try {
            //images
            //alt titles
            const result = await this.db.getClient().execute(
                `
                SELECT 
                    g.game_id AS id,
                    g.game_title AS title,
                    g.game_description AS description,
                    g.release_date AS releaseDate,
                    g.collection_id AS collectionId,
                    g.wishlisted,
                    s.state_name AS state,
                    p.platform_name AS platform,
                    c.country_name AS ReleaseCountry,
                    pub.publisher_name AS publisher,
                    d.developer_name AS developer,
                    gen.genre_name AS genre,
                    GROUP_CONCAT(DISTINCT img.image_url) AS images,   -- Aggregate images
                    GROUP_CONCAT(DISTINCT alt.alt_title) AS altTitles -- Aggregate alt titles
                FROM 
                    games g
                JOIN 
                    game_states s ON g.state_id = s.state_id
                JOIN 
                    platforms p ON g.platform_id = p.platform_id
                JOIN 
                    countries c ON g.release_country_code = c.country_code
                JOIN 
                    publishers pub ON g.publisher_id = pub.publisher_id
                JOIN 
                    developers d ON g.developer_id = d.developer_id
                JOIN 
                    genres gen ON g.genre_id = gen.genre_id
                LEFT JOIN 
                    images img ON g.game_id = img.game_id
                LEFT JOIN 
                    alt_titles alt ON g.game_id = alt.game_id
                WHERE 
                    g.game_id = ?
                GROUP BY 
                    g.game_id, g.game_title, g.game_description, g.release_date, g.collection_id, g.wishlisted,
                    s.state_name, p.platform_name, c.country_name, pub.publisher_name, d.developer_name, gen.genre_name
                `,
                [gameId]
            );
    
            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError("Game not found");
            }
    
            const row = result.rows[0];
    
            // Map to GameFull structure
            const game: GameFull = {
                id: row.id,
                title: row.title,
                description: row.description,
                releaseDate: row.releaseDate,
                collectionId: row.collectionId,
                wishlisted: row.wishlisted,
                state: row.state,
                platform: row.platform,
                ReleaseCountry: row.ReleaseCountry,
                publisher: row.publisher,
                developer: row.developer,
                genre: row.genre,
                images: row.images ? row.images.split(",") : [],            // Split images into an array
                altTitles: row.altTitles ? row.altTitles.split(",") : []     // Split alt titles into an array
            };
    
    
            return game;
        } catch (error) {
            console.error("Error in getGameDetails:", error);
            if (error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async updateGame(gameId: number, data: Game): Promise<number> {
        try{
            const result = await this.db.getClient().execute(
                `
                UPDATE games 
                SET 
                    game_title = ?, 
                    game_description = ?, 
                    release_date = ?, 
                    state_id = ?, 
                    platform_id = ?, 
                    release_country_code = ?, 
                    publisher_id = ?, 
                    developer_id = ?, 
                    genre_id = ?, 
                    collection_id = ?, 
                    wishlisted = ?
                WHERE 
                    game_id = ?
                `,
                [
                    data.title, 
                    data.description, 
                    data.releaseDate, 
                    data.stateId, 
                    data.platformId, 
                    data.ReleaseCountryCode, 
                    data.publisherID, 
                    data.developerID, 
                    data.genreId, 
                    data.collectionId, 
                    data.wishlisted,
                    gameId 
                ]
            );
    
            if(result.affectedRows === 0){
                throw new ValidationError("Game not updated");
            }
    
            return gameId;
        }catch(error){
            console.error('Error in updateGame:', error);
            if(error instanceof ValidationError) throw error;
            if ((error as Error).message.includes('Cannot add or update a child row: a foreign key constraint fails')) {
                throw new ForeignKeyError("ForeignKey error"); // Throw custom error
            }
            throw new Error('Database error');
        }
    }

    async updateAltTitles(gameId: number, altTitles: string[] = []): Promise<void> {
        try {
            await this.db.getClient().execute('DELETE FROM alt_titles WHERE game_id = ?', [gameId]);

            for (const title of altTitles) {
                await this.db.getClient().execute('INSERT INTO alt_titles (game_id, alt_title) VALUES (?, ?)', [gameId, title]);
            }
        } catch (error) {
            console.error("Error in updateAltTitles:", error);
            throw new Error("Database error");
        }
    }

    async addImagesToGame(gameId: number, imageUrls: string[]): Promise<void> {
        try {
            if (imageUrls.length === 0) {
                throw new ValidationError("No images to add");
            }
            for (const url of imageUrls) {
                await this.db.getClient().execute('INSERT INTO images (game_id, image_url) VALUES (?, ?)', [gameId, url]);
            }

        } catch (error) {
            console.error("Error in addImagesToGame:", error);
            throw new Error("Database error");
        }
    }
    
}