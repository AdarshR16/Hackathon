import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ForecastLocationSearch } from '../models/forecastlocationsearch';
import { Utils } from '../utils';

interface EventData {
    searchQuery: string;
    latitude: number;
    longitude: number;
    type: ForecastLocationSearch.Type;
}

@Component({
  selector: 'app-forecast-location-search',
  templateUrl: './forecast-location-search.component.html',
  styleUrls: ['./forecast-location-search.component.css']
})
export class ForecastLocationSearchComponent implements OnInit {
    searchQuery!: string;

    @Input()
    showQuerySearch!: boolean;
    
    @Output('searchLocation')
    searchLocationEmitter = new EventEmitter();
 
    constructor() { }

    ngOnInit(): void {
    }

    newEventData() {
        let eventData: EventData = {
            searchQuery: '',
            latitude: -1,
            longitude: -1,
            type: -1,
        };
        return eventData;
    }

    onSearchQueryLocation() {
        if (!this.searchQuery || this.searchQuery.trim().length == 0) {
            return;
        }
        let eventData = this.newEventData();
        eventData.searchQuery = this.searchQuery.trim(),
        eventData.type = ForecastLocationSearch.Type.SearchQuery,

        this.searchLocationEmitter.emit(eventData);
    }

    async onSearcGPSLocation() {
        try {
            let locationCacheMinutes = 2;
            let position = await Utils.getCurrentPosition({maximumAge: 60 * locationCacheMinutes * 1000});
            let eventData = this.newEventData();

            eventData.latitude = position.coords.latitude;
            eventData.longitude = position.coords.longitude;
            eventData.type = ForecastLocationSearch.Type.GPS;

            this.searchLocationEmitter.emit(eventData);
        } catch (error: any) {
            if (error.code 
                && (error.code == GeolocationPositionError.PERMISSION_DENIED 
                    || error.code == GeolocationPositionError.POSITION_UNAVAILABLE) 
                && (!Utils.isLocalNetwork() && !Utils.isSecureConnection())) {
                    let eventData = this.newEventData();
                    eventData.type = ForecastLocationSearch.Type.IP;        
                    this.searchLocationEmitter.emit(eventData);
            } else {
                Utils.displayError(error);            
            }
        }
    }    
}
