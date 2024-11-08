export interface GameFull {
    id?: number;
    title: string;
    description: string;
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