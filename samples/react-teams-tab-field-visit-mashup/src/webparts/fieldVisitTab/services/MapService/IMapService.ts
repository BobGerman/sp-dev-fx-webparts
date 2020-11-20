import { IMapLocation } from '../../model/IMapLocation';

// US only for now
export interface IMapService {
    getLocation (address: string, city: string, state: string, zip: string):
        Promise<IMapLocation>;
    getMapApiKey (): string;
    getMapImageUrl (address: string, city: string, state: string,
        country: string, postalCode: string, height?: number, width?: number):
        Promise<string>;
}