import type { GameFull } from '../../WebApi/mod.ts';
import { getEmbedding, calculateCosineSimilarity } from '../mod.ts'

export class SemanticSearchService {
        async findSimilarGames(query: string, titleEmbeddings: number[], genreEmbeddings: number[]) {
        //find embedding of query
        const queryEmbedding = await getEmbedding(query);
        // Step 1: Compute initial title-based similarity scores
        const titleSimilarityScore = calculateCosineSimilarity(queryEmbedding, titleEmbeddings);

        // Step 2: Compute genre-based similarity scores
        const genreSimilarityScore = calculateCosineSimilarity(queryEmbedding, genreEmbeddings);

        // Step 3: Combine title and genre similarity scores, e.g., with a 50-50 weighting
        const combinedScore = (titleSimilarityScore * 0.8) + (genreSimilarityScore * 0.2);

        return combinedScore;
    }

    async getGameEmbeddings(game: GameFull) {
        const title = game.game_title;
        const genre = game.genre.toString();

        const titleEmbedding = await getEmbedding(title);  // Embedding for title
        const genreEmbedding = await getEmbedding(genre);  // Embedding for genre

        return { titleEmbedding, genreEmbedding };
    }
}

