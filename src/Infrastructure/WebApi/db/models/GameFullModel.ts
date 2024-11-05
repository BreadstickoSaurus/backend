export interface GameFull {
    id?: number;
    title: string;
    description: string;
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