// ============================================================================
//   
// ============================================================================
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { PositionStack } from './models/positionstack';
import { WeatherBit } from './models/weatherbit';
import { PositionStackApiService, WeatherBitApiService } from './services/api.service';
import { Utils } from './utils';
import { ForecastLocationSearch } from './models/forecastlocationsearch';
import { RuntimeError } from './models/errors';
import { DataStoreService } from './services/data-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Angular Weather Forecast';
    
    debug = false;

    locationApiAvailable = true;
    isLoading = false;
    baseUrl: string;
          
    constructor(private http: HttpClient, private positionStackApi: PositionStackApiService
        , private weatherBitApi: WeatherBitApiService, public dataStore: DataStoreService) { 
        this.baseUrl = location.href;
    }

    ngOnInit() {
        if (!this.debug && this.hasAPIKeys()) {
            this.isLoading = true;
            this.loadInitialForecast().then(() => {
                console.log('Initial forecast load complete');
                this.isLoading = false;
            }).catch((error) => {
                console.log(error); 
                this.isLoading = false;              
            });
        }        
    }

    ngAfterViewInit(): void {
        this.maybeShowAPINotice();
    }

    async getIPAddress(): Promise<any> {
        return firstValueFrom(this.http.get("https://api.ipify.org/?format=json"));
    }

    async loadInitialForecast() {
        try {
            await this.ipAddressSearch();
        } catch (error) {
            if (error instanceof RuntimeError.ForecastLocationError) {
                this.locationApiAvailable = false;
                try {
                    // console.log(error);
                    console.log('Location api is unavailable, getting forecast from gps position');
                    let position = await Utils.getCurrentPosition();
                    await this.gpsSearch(position.coords.latitude, position.coords.longitude);             
                } catch(error2) {
                    Utils.displayError(error2);             
                }                
            } else if (error instanceof RuntimeError.ForecastError) {
                console.log('Weather api is unavailable');
                Utils.displayError(error);
            } else {
                Utils.displayError(error);
            }
        }
    }

    async ipAddressSearch() {
        let searchLocation = this.dataStore.getUserLocation();
        
        let ipData = await this.getIPAddress();
        let ipAddress = ipData.ip;

        if (searchLocation == null || !this.dataStore.lastSearchMatches(ForecastLocationSearch.Type.IP, {ipAddress})) {
            try {
                let locationResults = await this.positionStackApi.getForecastLocation(ForecastLocationSearch.Type.IP, {
                    ipAddress
                });
                searchLocation = locationResults.data[0];
            } catch (error: any) {
                let message = error.message ? error.message : error;
                throw new RuntimeError.ForecastLocationError(message, ForecastLocationSearch.Type.IP);
            }
        }

        let forecast: any
        try {
            forecast = await this.weatherBitApi.getForecast(searchLocation.latitude, searchLocation.longitude);
        } catch (error: any) {
            let message = error.message ? error.message : error;
            throw new RuntimeError.ForecastError(message);
        }

        this.dataStore.setUserLocation(searchLocation);

        this.dataStore.setCurrentForecast({
            currentForecast: forecast.current,
            currentDailyForecast: forecast.daily,
            currentForecastLocation: searchLocation,
        });

        this.dataStore.updateLastSearchData({
            longitude: searchLocation.longitude,
            latitude: searchLocation.latitude,            
            ipAddress,
        });         
    }    
      
    async querySearch(searchQuery: string) {
        let searchLocation = this.dataStore.getCurrentForecastLocation();
        if (this.locationApiAvailable && 
            (searchLocation == null || !this.dataStore.lastSearchMatches(ForecastLocationSearch.Type.SearchQuery, {searchQuery}))) {
            
            let locationResults = await this.positionStackApi.getForecastLocation(ForecastLocationSearch.Type.SearchQuery, {
                searchQuery: searchQuery
            });
            searchLocation = locationResults.data[0];

            // Get the location that is the shortest distance from the user
            if (this.dataStore.getUserLocation() != null) {
                searchLocation = PositionStack.getNearestLocation(this.dataStore.getUserLocation().latitude, this.dataStore.getUserLocation().longitude, locationResults);
            }
        }
        
        let forecast = await this.weatherBitApi.getForecast(searchLocation.latitude, searchLocation.longitude);

        this.dataStore.setCurrentForecast({
            currentForecast: forecast.current,
            currentDailyForecast: forecast.daily,
            currentForecastLocation: searchLocation,
        });

        this.dataStore.updateLastSearchData({
            longitude: searchLocation.longitude,
            latitude: searchLocation.latitude,
            searchQuery
        });      
    }

    async gpsSearch(latitude: number, longitude: number) {   
        let searchLocation = this.dataStore.getCurrentForecastLocation();     
        if (this.locationApiAvailable &&
            (searchLocation == null || !this.dataStore.lastSearchMatches(ForecastLocationSearch.Type.GPS, {latitude, longitude}))) {
                
            this.dataStore.updateLastSearchData({
                searchQuery: ''
            });  

            let locationResults = await this.positionStackApi.getForecastLocation(ForecastLocationSearch.Type.GPS, {
                latitude, longitude
            });
            searchLocation = locationResults.data[0];
        }

        let forecast = await this.weatherBitApi.getForecast(latitude, longitude);

        this.dataStore.setUserLocation(searchLocation);
        
        this.dataStore.setCurrentForecast({
            currentForecast: forecast.current,
            currentDailyForecast: forecast.daily,
            currentForecastLocation: searchLocation,
        });
 
        this.dataStore.updateLastSearchData({
            longitude,
            latitude,
        });               
    }

    async onSearchLocation(eventData: any) {
        // console.log(eventData);
        this.isLoading = true;
        let type = eventData.type;
        try {
            switch(type) {
                case ForecastLocationSearch.Type.IP:
                    await this.ipAddressSearch();
                    break;                
                case ForecastLocationSearch.Type.SearchQuery:
                    await this.querySearch(eventData.searchQuery);
                    break;
                case ForecastLocationSearch.Type.GPS:
                    await this.gpsSearch(eventData.latitude, eventData.longitude);                                    
                    break;
                default:
                    throw new Error(`Unknown search type: ${type}`);
                    break;
            }
            if (this.dataStore.getCurrentForecastLocation() != null) {
                // console.log('Selected Location:', this.dataStore.getCurrentForecastLocation());
            }
        } catch (error) {
            Utils.displayError(error);
            this.maybeShowAPINotice();
        } finally {
            this.isLoading = false;
        }
    } 

    hasAPIKeys() {
        return this.positionStackApi.hasKey() && this.weatherBitApi.hasKey();
    }

    maybeShowAPINotice() {
        if (!this.positionStackApi.hasKey()) {
            alert('A https://positionstack.com/ API Key is not defined. Please register an account to obtain your own free api key, and then set it within the PositionStackApiService class in the app/services folder');
        } 
        if (!this.weatherBitApi.hasKey()) {
            alert('A https://www.weatherbit.io/ API Key is not defined. Please register an account to obtain your own free api key, and then set it within the WeatherBitApiService class in the app/services folder');
        }
    }   
}