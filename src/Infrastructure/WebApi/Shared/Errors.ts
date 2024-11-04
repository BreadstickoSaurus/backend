export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

export class ForeignKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForeignKeyError";
    }
}