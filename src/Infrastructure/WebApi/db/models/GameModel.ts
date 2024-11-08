export interface Game{
    game_id?: number;
    game_title: string;
    game_description: string;
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