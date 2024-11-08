export interface GameFull {
    game_id?: number;
    game_title: string;
    game_description: string;
    release_date: Date;
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