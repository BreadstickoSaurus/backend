export interface Game{
    game_id?: number;
    game_title: string;
    game_description: string;
    release_date: Date;
    collectionId: number;
    wishlisted: number;
    stateId: number;
    platformId: number;
    ReleaseCountryCode: string;
    publisherID: number;
    developerID: number;
    genreId: number;
}