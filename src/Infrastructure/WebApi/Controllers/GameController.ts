import { ServiceLocator } from '../../Shared/mod.ts';
import type { MySqlRepository, GameFull, Game } from '../mod.ts';
import { SemanticSearchService } from '../../Shared/mod.ts';
import { promise } from '@zod';

export class GameController {
    private repository: MySqlRepository
    private searchService: SemanticSearchService

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
        this.searchService = new SemanticSearchService();
    }

    async getCollectionId(gameId: number): Promise<number> {
        try {
            const collectionId = await this.repository.getCollectionIdByGameId(gameId);
            return collectionId;
        }
        catch (error) {
            throw error;
        }
    }

    async getWishlistValue(gameId: number): Promise<number> {
        try {
            const wishlistValue = await this.repository.getWishlistValue(gameId);
            return wishlistValue;
        }
        catch (error) {
            throw error;
        }
    }

    async updateGame(gameId: number, data: Game): Promise<number> {
        try {
            const game = await this.repository.updateGame(gameId,data);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async updateAltTitles(gameId: number, altTitles: string[]): Promise<void> {
        try {
            const game = await this.repository.updateAltTitles(gameId, altTitles);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async getGamesFromCollection(userId: number): Promise<Game[]> {
        try{
            const games = await this.repository.getGamesFromCol(userId);
            return games;
        } catch(error){
            throw error;
        }
    }

    async getGameFromWishlist(userId: number): Promise<Game[]> {
        try{
            const games = await this.repository.getGamesFromWishlist(userId);
            return games;
        } catch(error){
            throw error;
        }
    }

    async getGameDetails(gameId: number): Promise<GameFull> {
        try {
            const game = await this.repository.getGameDetails(gameId);
            return game;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteGame(gameId: number): Promise<void> {
        try {
            await this.repository.deleteGame(gameId);
        }
        catch (error) {
            throw error;
        }
    }

    async addGameToCol(userId: number, data: Game): Promise<number> {
        data.collectionId = await this.repository.getCollectionId(userId);
        try{
            const gameId = await this.repository.addGameToCol(data);
            const fullgame = await this.repository.getGameDetails(gameId);
            const embedding = await this.searchService.getGameEmbeddings(fullgame);
            await this.repository.addGameEmbeddings(gameId, embedding);
            return gameId;
        } catch(error){
            throw error;
        }
    }

    async getGamesUsingSemanticSearch(query: string): Promise<GameFull[]> {
        try {
            // Fetch all games
            const games = await this.repository.getAllWishlistGamesFull();
    
            // If no query provided, return all games
            if (!query) {
                return games;
            }
        
            // Step 2: Compute scores for each game
            const combinedScore: { game: GameFull; score: number }[] = (await Promise.all(
                games.map(async (game) => {
                    if (!game.game_id) {
                        return null; // Skip games without a valid ID
                    }

                    const titleEmbedding = await this.repository.getTitleEmbedding(game.game_id);
                    const genreEmbedding = await this.repository.getGenreEmbedding(game.game_id);
    
                    const score = await this.searchService.findSimilarGames(
                        query,
                        titleEmbedding,
                        genreEmbedding
                    );
    
                    return { game, score };
                })
            )).filter((entry): entry is { game: GameFull; score: number } => entry !== null);
    
            // Remove null entries and sort by score in descending order
            const sortedGames = combinedScore
                .sort((a, b) => b.score - a.score)
                .map((entry) => entry.game);
    
            return sortedGames;
        } catch (error) {
            console.error("Error in getGamesUsingSemanticSearch:", error);
            throw error;
        }
    }

    async getGamesUsingSearch(query: string): Promise<GameFull[]> {
        console.log("huh");
        try{
            const games = await this.repository.getAllWishlistGamesFull();
            if(query === ""){
                return games;
            }
            const filteredGames = games.filter(game => game.game_title.toLowerCase().includes(query.toLowerCase()));
            return filteredGames;
        }catch(error){
            console.error("Error in getGamesUsingSearch:", error);
            throw error;
        }
    }

    async setCollectionState(collectionId: number, isPublic: boolean): Promise<void> {
        try{
            await this.repository.setCollectionState(collectionId, isPublic);
        }catch(error){
            throw error;
        }
    }
    
}