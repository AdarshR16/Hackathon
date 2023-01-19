// ============================================================================
//  
// ============================================================================
import { Component, Input, OnInit } from '@angular/core';
import { WeatherBit } from '../models/weatherbit';
import { Utils } from '../utils'

@Component({
  selector: 'app-current-forecast',
  templateUrl: './current-forecast.component.html',
  styleUrls: ['./current-forecast.component.css']
})
export class CurrentForecastComponent implements OnInit {

    @Input()
    forecast!: WeatherBit.Current.Forecast;

    localDate!: string;
    
    constructor() { }

    ngOnInit(): void {
        this.localDate = this.getLocalDateString();
    }

    getForcastImgSrc() {
        return WeatherBit.getForcastImgSrc(this.forecast.weather.icon);
    }

    getTimeOfDay() {
        return this.forecast.pod == 'd' ? 'Day' : 'Night';
    }

    getOutsideDescription() {
        return this.forecast.weather.description;
    }

    getLocalDateString() {
        let date = this.toLocalDatetime(new Date());
        return `${Utils.getWeekdayName(date)} ${Utils.getDateTimeString(date)}`;
    }

    getLocalSunrise() {
        let split = this.forecast.sunrise.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));
        return Utils.getTimeString(this.toLocalDatetime(Utils.treatAsUTC(date)));
    }

    getLocalSunset() {
        let split = this.forecast.sunset.split(':');
        let date = new Date();
        date.setHours(Number(split[0]));
        date.setMinutes(Number(split[1]));        
        return Utils.getTimeString(this.toLocalDatetime(Utils.treatAsUTC(date)));
    }

    getLastUpdated() {
        let date = new Date(this.forecast.ob_time);
        return Utils.getTimeString(this.toLocalDatetime(Utils.treatAsUTC(date)));
    }

    toLocalDatetime(date: Date) {
        return Utils.convertTimezone(date, this.forecast.timezone);
    }

    getAirQualityDescription() {
        return WeatherBit.getAirQualityDescription(this.forecast.aqi);
    }

    getAirQualityCss() {
        let desc = this.getAirQualityDescription();
        let className = desc.replace(' ', '-').toLowerCase();
        return `air-quality ${className}`;
    } 
    
    getUVIndexDescription() {
        return WeatherBit.getUVIndexDescription(this.forecast.uv);
    }

    getUVIndexCss() {
        let desc = this.getUVIndexDescription();
        let className = desc.replace(' ', '-').toLowerCase();
        return `uv-index ${className}`;
    }    
}