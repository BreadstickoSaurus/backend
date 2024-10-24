import { z } from '@zod';
import { ErrorsBag } from '../../Shared/mod.ts'; // Adjust this import path based on your folder structure

/**
 * Generic validation function for any Zod schema
 * @param data - The data to validate (parsed JSON request body)
 * @param schema - The Zod schema to validate against
 * @param errorsBag - Instance of ErrorsBag to store validation errors
 */
export function validateRequest(
    data: any,
    schema: z.AnyZodObject,
    errorsBag: ErrorsBag
): void {
    errorsBag.clear();

    const result = schema.safeParse(data);

    if (!result.success) {
        // Add each validation error to the errors bag
        result.error.errors.forEach((err) => {
            const field = err.path[0].toString(); // Field name, e.g., 'password'
            const message = err.message; // Descriptive error message from Zod
            errorsBag.add(field, message); // Store field and message in errorsBag
        });
    }
}