export class ErrorsBag {
    protected errors: Record<string, string[]> = {};

    // Clear all errors
    public clear(): void {
        this.errors = {};
    }

    // Add an error for a specific field
    public add(field: string, message: string): void {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        this.errors[field].push(message);
    }

    // Check if there are any errors
    public hasErrors(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    // Get all errors
    public getErrors(): Record<string, string[]> {
        return this.errors;
    }
}