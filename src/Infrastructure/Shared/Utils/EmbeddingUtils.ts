import * as dotenv from '@dotenv';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getEmbedding(text: string): Promise<number[]> {
    try {
        const apiKey = dotenv.config().API_KEY;

        const response = await fetch("https://api.cohere.ai/v1/embed", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,  // Replace with your actual API key
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                texts: [text], // Pass the text in an array format
                model: "embed-english-light-v2.0", // Use Cohere's embedding model
            }),
        });

        if (!response.ok) {
            throw new Error(`Cohere API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.embeddings[0];  // Cohere returns an array of embeddings, we take the first one
    } catch (error) {
        console.error("Error getting embedding from Cohere:", error);
        throw new Error("Failed to fetch embedding from Cohere API");
    }
}


export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
