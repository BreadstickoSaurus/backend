export interface GameFull {
    game_id?: number;
    game_title: string;
    game_description: string;
    releaseDate: Date;
    collectionId: number;
    wishlisted: boolean;
    state: object;
    platform: object; 
    releaseCountry: object; 
    publisher: object; 
    developer: object; 
    genre: object;
    images: string[];
    altTitles: string[]; 
}