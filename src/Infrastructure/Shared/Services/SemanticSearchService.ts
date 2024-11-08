import type { GameFull } from '../../WebApi/mod.ts';
import { getEmbedding, calculateCosineSimilarity } from '../mod.ts'

export class SemanticSearchService {
    async findSimilarGames(query: string, games: GameFull[]) {
        const queryEmbedding = await getEmbedding(query);

        // Step 1: Compute initial title-based similarity scores
        const scoredGames = await Promise.all(games.map(async (game) => {
            const titleEmbedding = await getEmbedding(game.game_title); // Embedding for title
            const titleSimilarityScore = calculateCosineSimilarity(queryEmbedding, titleEmbedding);
            return { ...game, titleSimilarityScore };
        }));

        // Step 2: Sort games by title similarity to find the top match
        scoredGames.sort((a, b) => b.titleSimilarityScore - a.titleSimilarityScore);

        // Step 3: Get the genre of the top match and compute its embedding
        const topGenre = scoredGames[0].genre; // Assuming genre is a field on Game
        const genreEmbedding = await getEmbedding(topGenre);

        // Step 4: Calculate genre similarity for each game and combine with title similarity
        const finalScoredGames = await Promise.all(scoredGames.map(async (game) => {
            const gameGenreEmbedding = await getEmbedding(game.genre); // Embedding for each game's genre
            const genreSimilarityScore = calculateCosineSimilarity(genreEmbedding, gameGenreEmbedding);

            // Combine title and genre similarity scores, e.g., with a 50-50 weighting
            const combinedScore = (game.titleSimilarityScore * 0.5) + (genreSimilarityScore * 0.5);

            return { ...game, combinedScore };
        }));

        // Step 5: Sort by combined score
        finalScoredGames.sort((a, b) => b.combinedScore - a.combinedScore);

        return finalScoredGames as GameFull[];
    }
}

