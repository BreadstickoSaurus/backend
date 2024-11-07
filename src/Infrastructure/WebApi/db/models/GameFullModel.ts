export interface GameFull {
    game_id?: number;
    game_title: string;
    game_description: string;
    releaseDate: Date;
    collectionId: number;
    wishlisted: boolean;
    state: string;
    platform: string; 
    ReleaseCountry: string; 
    publisher: string; 
    developer: string; 
    genre: string;
    images: string[];
    altTitles: string[]; 
}