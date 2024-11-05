export interface Game{
    id?: number;
    title: string;
    description: string;
    releaseDate: Date;
    collectionId: number;
    wishlisted: number;
    stateId: number;
    platformId: number;
    ReleaseCountryCode: string;
    publisherID: number;
    developerID: number;
    genreId: number;
}