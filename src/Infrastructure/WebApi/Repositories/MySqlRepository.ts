import type { GameFull } from '../db/models/GameFullModel.ts';
import { AuthenticationError, Database, ForeignKeyError, Game, User, ValidationError, type Country, type Developer, type Genre, type Platform, type Publisher, type State } from "../mod.ts";

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

            const colId = result.lastInsertId;
            if (colId === undefined) {
                throw new Error('Failed to retrieve collection ID');
            }
            await this.db.getClient().execute(
                'INSERT INTO collectionState (collection_id, public) VALUES (?, ?)',
                [colId, true]
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
                throw new ValidationError("userId not found");
            }
            return result.rows[0].collection_id;
        } catch (error) {
            console.error("Error in getCollectionId:", error);
            throw new ValidationError("UserID not found");
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
                [data.game_title, data.game_description, data.release_date, data.stateId, data.platformId, data.ReleaseCountryCode, data.publisherID, data.developerID, data.genreId, data.collectionId, wishlisted]
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
                    s.state_name AS stateName,
                    s.state_id AS stateId,
                    p.platform_name AS platformName,
                    p.platform_id AS platformId,
                    c.country_name AS ReleaseCountryName,
                    c.country_code AS ReleaseCountryCode,
                    pub.publisher_name AS publisherName,
                    pub.publisher_id AS publisherId,
                    d.developer_name AS developerName,
                    d.developer_id AS developerId,
                    gen.genre_name AS genreName,
                    gen.genre_id AS genreId,
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
                game_id: row.id,
                game_title: row.title,
                game_description: row.description,
                release_date: row.releaseDate,
                collectionId: row.collectionId,
                wishlisted: row.wishlisted,
                state: {
                    name: row.stateName,
                    id: row.stateId
                },
                platform: {
                    name: row.platformName,
                    id: row.platformId
                },
                releaseCountry: {
                    name: row.ReleaseCountryName,
                    code: row.ReleaseCountryCode
                },
                publisher: {
                    name: row.publisherName,
                    id: row.publisherId
                },
                developer: {
                    name: row.developerName,
                    id: row.developerId
                },
                genre: {
                    name: row.genreName,
                    id: row.genreId
                },
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
                    genre_id = ?
                WHERE 
                    game_id = ?;
                `,
                // collection_id = ?, 
                // wishlisted = ?
                [
                    data.game_title, 
                    data.game_description, 
                    data.release_date, 
                    data.stateId, 
                    data.platformId, 
                    data.ReleaseCountryCode, 
                    data.publisherID, 
                    data.developerID, 
                    data.genreId, 
                    // data.collectionId, 
                    // data.wishlisted,
                    gameId 
                ]
            );
    
            // if(result.affectedRows === 0){
            //     throw new ValidationError("Game not updated");
            // }
    
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
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getImagesFromGame(gameId: number): Promise<string[]> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT image_url FROM images WHERE game_id = ?',
                [gameId]
            );

            if (!result.rows) {
                throw new ValidationError("Images not found");
            }

            return result.rows.map((row: any) => row.image_url);
        } catch (error) {
            console.error("Error in getImagesFromGame:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deleteImageFromGame(gameId: number, imageUrl: string): Promise<void> {
        try {
            const result = await this.db.getClient().execute(
                'DELETE FROM images WHERE game_id = ? AND image_url = ?',
                [gameId, imageUrl]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError("Image not found");
            }
        } catch (error) {
            console.error("Error in deleteImageFromGame:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deleteGame(gameId: number): Promise<void> {
        try {
            await this.db.getClient().execute('DELETE FROM images WHERE game_id = ?', [gameId]);
            await this.db.getClient().execute('DELETE FROM alt_titles WHERE game_id = ?', [gameId]);
            await this.db.getClient().execute('DELETE FROM games_embedding WHERE game_id = ?', [gameId]);
            const result = await this.db.getClient().execute(
                'DELETE FROM games WHERE game_id = ?',
                [gameId]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError("Game not found");
            }
        } catch (error) {
            console.error("Error in deleteGame:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async addPlatform(platform: Platform): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'INSERT INTO platforms (platform_name,platform_description,release_date) VALUES (?,?,?)',
                [platform.platform_name, platform.platform_description, platform.release_date]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError('Platform not added');
            }

            const platformId = result.lastInsertId;
            if (platformId === undefined) {
                throw new Error('Failed to retrieve platform ID');
            }

            return platformId;
        } catch (error) {
            console.error("Error in addPlatform:", error);
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError('Platform already exists');
            }
            throw new Error("Database error");
        }
    }

    async getPlatforms(): Promise<Platform[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM platforms');
            if (!result.rows) {
                throw new ValidationError('Platforms not found');
            }
            return result.rows as Platform[];
        } catch (error) {
            console.error("Error in getPlatforms:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getPlatform(platformId: number): Promise<Platform> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM platforms WHERE platform_id = ?', [platformId]);

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Platform not found');
            }

            return result.rows[0] as Platform;
        } catch (error) {
            console.error("Error in getPlatform:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deletePlatform(platformId: number): Promise<void> {
        try {
            const result = await this.db.getClient().execute('DELETE FROM platforms WHERE platform_id = ?', [platformId]);

            if (result.affectedRows === 0) {
                throw new ValidationError('Platform not found');
            }
        } catch (error) {
            console.error("Error in deletePlatform:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async addPublisher(publisher: Publisher): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'INSERT INTO publishers (publisher_name, publisher_description, country_code) VALUES (?,?,?)',
                [publisher.publisher_name, publisher.publisher_description, publisher.country_code]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError('Publisher not added');
            }

            const publisherId = result.lastInsertId;
            if (publisherId === undefined) {
                throw new Error('Failed to retrieve publisher ID');
            }

            return publisherId;
        } catch (error) {
            console.error("Error in addPublisher:", error);
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError('Publisher already exists');
            }
            throw new Error("Database error");
        }
    }

    async getPublishers(): Promise<Publisher[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM publishers');
            if (!result.rows) {
                throw new ValidationError('Publishers not found');
            }
            return result.rows as Publisher[];
        } catch (error) {
            console.error("Error in getPublishers:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getPublisher(publisherId: number): Promise<Publisher> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM publishers WHERE publisher_id = ?', [publisherId]);

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Publisher not found');
            }

            return result.rows[0] as Publisher;
        } catch (error) {
            console.error("Error in getPublisher:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deletePublisher(publisherId: number): Promise<void> {
        try {
            const result = await this.db.getClient().execute('DELETE FROM publishers WHERE publisher_id = ?', [publisherId]);

            if (result.affectedRows === 0) {
                throw new ValidationError('Publisher not found');
            }
        } catch (error) {
            console.error("Error in deletePublisher:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async addDeveloper(developer: Developer): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'INSERT INTO developers (developer_name, developer_description, country_code) VALUES (?,?,?)',
                [developer.developer_name, developer.developer_description, developer.country_code]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError('Developer not added');
            }

            const developerId = result.lastInsertId;
            if (developerId === undefined) {
                throw new Error('Failed to retrieve developer ID');
            }

            return developerId;
        } catch (error) {
            console.error("Error in addDeveloper:", error);
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError('Developer already exists');
            }
            throw new Error("Database error");
        }
    }

    async getDevelopers(): Promise<Developer[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM developers');
            if (!result.rows) {
                throw new ValidationError('Developers not found');
            }
            return result.rows as Developer[];
        } catch (error) {
            console.error("Error in getDevelopers:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getDeveloper(developerId: number): Promise<Developer> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM developers WHERE developer_id = ?', [developerId]);

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Developer not found');
            }

            return result.rows[0] as Developer;
        } catch (error) {
            console.error("Error in getDeveloper:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deleteDeveloper(developerId: number): Promise<void> {
        try {
            const result = await this.db.getClient().execute('DELETE FROM developers WHERE developer_id = ?', [developerId]);

            if (result.affectedRows === 0) {
                throw new ValidationError('Developer not found');
            }
        } catch (error) {
            console.error("Error in deleteDeveloper:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async addGenre(genre: Genre): Promise<number> {
        try {
            const result = await this.db.getClient().execute(
                'INSERT INTO genres (genre_name) VALUES (?)',
                [genre.genre_name]
            );

            if (result.affectedRows === 0) {
                throw new ValidationError('Genre not added');
            }

            const genreId = result.lastInsertId;
            if (genreId === undefined) {
                throw new Error('Failed to retrieve genre ID');
            }

            return genreId;
        } catch (error) {
            console.error("Error in addGenre:", error);
            if ((error as Error).message.includes("Duplicate entry")) {
                throw new ValidationError('Genre already exists');
            }
            throw new Error("Database error");
        }
    }

    async getGenres(): Promise<Genre[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM genres');
            if (!result.rows) {
                throw new ValidationError('Genres not found');
            }
            return result.rows as Genre[];
        } catch (error) {
            console.error("Error in getGenres:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getGenre(genreId: number): Promise<Genre> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM genres WHERE genre_id = ?', [genreId]);

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Genre not found');
            }

            return result.rows[0] as Genre;
        } catch (error) {
            console.error("Error in getGenre:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async deleteGenre(genreId: number): Promise<void> {
        try {
            const result = await this.db.getClient().execute('DELETE FROM genres WHERE genre_id = ?', [genreId]);

            if (result.affectedRows === 0) {
                throw new ValidationError('Genre not found');
            }
        } catch (error) {
            console.error("Error in deleteGenre:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getStates(): Promise<State[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM game_states');
            if (!result.rows) {
                throw new ValidationError('States not found');
            }
            return result.rows as State[];
        } catch (error) {
            console.error("Error in getStates:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getCountries(): Promise<Country[]> {
        try {
            const result = await this.db.getClient().execute('SELECT * FROM countries');
            if (!result.rows) {
                throw new ValidationError('Countries not found');
            }
            return result.rows as Country[];
        } catch (error) {
            console.error("Error in getCountries:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getAllWishlistGamesFull() : Promise<GameFull[]> {
        try {
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
                GROUP_CONCAT(DISTINCT img.image_url) AS images,
                GROUP_CONCAT(DISTINCT alt.alt_title) AS altTitles
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
                g.wishlisted = 1
            GROUP BY 
                g.game_id, g.game_title, g.game_description, g.release_date, g.collection_id, g.wishlisted,
                s.state_name, p.platform_name, c.country_name, pub.publisher_name, d.developer_name, gen.genre_name
            `
            );

            if (!result.rows || result.rows.length === 0) {
            throw new ValidationError("No wishlisted games found");
            }

            const games: GameFull[] = result.rows.map((row: any) => ({
            game_id: row.id,
            game_title: row.title,
            game_description: row.description,
            release_date: row.releaseDate,
            collectionId: row.collectionId,
            wishlisted: row.wishlisted,
            state: row.state,
            platform: row.platform,
            releaseCountry: row.ReleaseCountry,
            publisher: row.publisher,
            developer: row.developer,
            genre: row.genre,
            images: row.images ? row.images.split(",") : [],
            altTitles: row.altTitles ? row.altTitles.split(",") : []
            }));
            return games;
        } catch (error) {
            console.error("Error in getAllWishlistGamesFull:", error);
            if (error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async addAltTitlesToGame(gameId: number, altTitles: string[]): Promise<void> {
        try {
            for (const title of altTitles) {
                await this.db.getClient().execute('INSERT INTO alt_titles (game_id, alt_title) VALUES (?, ?)', [gameId, title]);
            }
        } catch (error) {
            console.error("Error in addAltTitlesToGame:", error);
            throw new Error("Database error");
        }
    }

    async deleteAltTitlesFromGame(gameId: number, altTitles: string[]): Promise<void> {
        try {
            for (const title of altTitles) {
                await this.db.getClient().execute('DELETE FROM alt_titles WHERE game_id = ? AND alt_title = ?', [gameId, title]);
            }
        } catch (error) {
            console.error("Error in deleteAltTitlesFromGame:", error);
            throw new Error("Database error");
        }
    }

    async addGameEmbeddings (gameId: number, embeddings: { titleEmbedding: number[], genreEmbedding: number[] }): Promise<void> {

        const titleEmbeddingJson = JSON.stringify(embeddings.titleEmbedding);
        const genreEmbeddingJson = JSON.stringify(embeddings.genreEmbedding);

        try {
            console.log(embeddings);
            await this.db.getClient().execute(
                'INSERT INTO games_embedding (game_id, embedding_value_title, embedding_value_genre) VALUES (?, ?, ?)',
                [gameId, titleEmbeddingJson, genreEmbeddingJson]
            );
        } catch (error) {
            console.error("Error in addGameEmbeddings:", error);
            throw new Error("Database error");
        }
    }

    async getTitleEmbedding(gameId: number): Promise<number[]> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT embedding_value_title FROM games_embedding WHERE game_id = ?',
                [gameId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Title embedding not found');
            }

            return JSON.parse(result.rows[0].embedding_value_title);
        } catch (error) {
            console.error("Error in getTitleEmbedding:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async getGenreEmbedding(gameId: number): Promise<number[]> {
        try {
            const result = await this.db.getClient().execute(
                'SELECT embedding_value_genre FROM games_embedding WHERE game_id = ?',
                [gameId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Genre embedding not found');
            }

            return JSON.parse(result.rows[0].embedding_value_genre);
        } catch (error) {
            console.error("Error in getGenreEmbedding:", error);
            if(error instanceof ValidationError) throw error;
            throw new Error("Database error");
        }
    }

    async setCollectionState(collectionId: number, isPublic: boolean){
        try{
            const result = await this.db.getClient().execute(
                'UPDATE collectionState SET public = ? WHERE collection_id = ?',
                [isPublic, collectionId]
            );

            if(result.affectedRows === 0){
                throw new ValidationError("Collection not found");
            }
        }catch(error){
            console.error('Error in setCollectionState:', error);
            if(error instanceof ValidationError) throw error;
            throw new Error('Database error');
        }
    }

    async getCollectionState(collectionId: number): Promise<boolean>{
        try{
            const result = await this.db.getClient().execute(
                'SELECT public FROM collectionState WHERE collection_id = ?',
                [collectionId]
            );

            if (!result.rows || result.rows.length === 0) {
                throw new ValidationError('Collection not found');
            }

            return result.rows[0].public;
        }catch(error){
            console.error('Error in getCollectionState:', error);
            if(error instanceof ValidationError) throw error;
            throw new Error('Database error');
        }
    }

}