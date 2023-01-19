// ============================================================================
//   
// ============================================================================
import { Component, Input, OnInit } from '@angular/core';
import { WeatherBit } from '../models/weatherbit';
import { Utils } from '../utils';

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.css']
})
export class DailyForecastComponent implements OnInit {

    @Input()
    forecast!: WeatherBit.Daily.Forecast;

    @Input()
    timezone!: string;
    
    forecastDateString!: string;
    constructor() { }

    ngOnInit(): void {
        this.forecastDateString = this.getForcastDateString();
    }

    getForcastDateString() {
        let localDate = this.toLocalDatetime(new Date());

        let parts = this.forecast.valid_date.split('-');
        // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
        // January - 0, February - 1, etc.
        let date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));         

        if (date.getMonth() == localDate.getMonth() 
            && date.getDate() == localDate.getDate() 
            && date.getFullYear() == localDate.getFullYear()) {
            return 'Today';
        }

        return date.toLocaleString('default', {
            month: 'short',
            day  : '2-digit',
            weekday: 'short',
            timeZone: 'UTC',
        });       
    }

    getForcastImgSrc() {
        return WeatherBit.getForcastImgSrc(this.forecast.weather.icon);
    }
    
    getUVIndexDescription() {
        return WeatherBit.getUVIndexDescription(this.forecast.uv);
    }

    getUVIndexCss() {
        let desc = this.getUVIndexDescription();
        let className = desc.replace(' ', '-').toLowerCase();
        return `uv-index ${className}`;
    }    
    
    toLocalDatetime(date: Date) {
        return Utils.convertTimezone(date, this.timezone);
    }    
}
