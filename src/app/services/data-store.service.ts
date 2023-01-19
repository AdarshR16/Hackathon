// ============================================================================

// ============================================================================
import { Injectable } from '@angular/core';
import { ForecastLocationSearch } from '../models/forecastlocationsearch';
import { PositionStack } from '../models/positionstack';
import { WeatherBit } from '../models/weatherbit';

interface ForecastData {
    currentForecastLocation: PositionStack.Location | any;
    currentForecast: WeatherBit.Current.Forecast | any;
    currentDailyForecast: WeatherBit.Daily.Forecast[];
}

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

    private userLocation!: PositionStack.Location;
        
    baseUrl!: string;
    lastSearchData: ForecastLocationSearch.Options = {
        searchQuery: '',
        longitude: 0,
        latitude: 0,
        ipAddress: ''
    };

    private forecastData: ForecastData = {
        currentForecastLocation!: undefined,
        currentForecast!: undefined,
        currentDailyForecast: []
    };
        
    constructor() { }

    getUserLocation(): PositionStack.Location {
        return this.userLocation;
    }
    
    getCurrentForecastLocation(): PositionStack.Location {
        return this.forecastData.currentForecastLocation;
    }

    getCurrentForecast(): WeatherBit.Current.Forecast {
        return this.forecastData.currentForecast;
    }    

    getCurrentDailyForecast(): WeatherBit.Daily.Forecast[] {
        return this.forecastData.currentDailyForecast;
    }       

    setUserLocation(data: PositionStack.Location) {
        this.userLocation = data;
    }

    setCurrentForecast(data: ForecastData) { 
        this.copyProps(data, this.forecastData);      
    }

    updateLastSearchData(data: ForecastLocationSearch.Options) {
        this.copyProps(data, this.lastSearchData);
    }

    lastSearchMatches(type: ForecastLocationSearch.Type, options: ForecastLocationSearch.Options) {
        switch (type) {
            case ForecastLocationSearch.Type.IP:
                return this.lastSearchData.ipAddress == options.ipAddress;
                break;            
            case ForecastLocationSearch.Type.GPS:
                return this.lastSearchData.longitude == options.longitude 
                    && this.lastSearchData.latitude == options.latitude;
                break;
            case ForecastLocationSearch.Type.SearchQuery:
                return this.lastSearchData.searchQuery == options.searchQuery;
                break;     
            default:
                throw new Error(`Unknown search type: ${type}`);
                break;                           
        }
        return false;
    }

    private copyProps(source: any, destination: any) {
        for (let prop in source) {
            if (source[prop] != undefined) {
                destination[prop] = source[prop];                
            }
        }        
    }
}