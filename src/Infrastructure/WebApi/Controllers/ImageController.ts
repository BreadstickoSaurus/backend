import { ServiceLocator } from '../../Shared/mod.ts';
import type { MySqlRepository } from '../mod.ts';
import { readAll } from "@std/io/read-all";


export class ImageController {
    private repository: MySqlRepository

    constructor() {
        this.repository = ServiceLocator.get<MySqlRepository>('MySqlRepository');
    }
    async storeImage(file: any): Promise<string> {
        try{
            const randomName = crypto.getRandomValues(new Uint32Array(1))[0].toString();
            const extension = file.name.split('.').pop(); // Get original file extension
            const newFileName = `${randomName}.${extension}`; // Combine random sequence and extension
            
            const filePath = `./images/${newFileName}`;
        
            // Write the file to disk
            const buffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);
            await Deno.writeFile(filePath, uint8Array);
    
            // Return the URL of the uploaded image
            // Assuming the base URL is known or can be constructed
            const baseUrl = `http://localhost:8888/uploads`; // Change to the correct path
            return `${baseUrl}/${newFileName}`; // Adjusted to return the correct URL
        }catch(error){
            throw error
        }
   }
   async saveImageUrls(gameId: number, imageUrls: string[]): Promise<void> {
        await this.repository.addImagesToGame(gameId, imageUrls);
   }
   async getImageUrls(gameId: number): Promise<string[]> {
        return await this.repository.getImagesFromGame(gameId);
   }
}