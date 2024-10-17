import { Module } from '../Shared/mod.ts';

export class WebApiModule implements Module {
    run(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}