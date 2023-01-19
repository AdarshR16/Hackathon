// ============================================================================
//    
// ============================================================================
export namespace WeatherBit {   
    export namespace Current {      
        export interface Result {
            data: Forecast[]
            count: number
        }
        
        export interface Forecast {
            rh: number
            pod: string
            lon: number
            pres: number
            timezone: string
            ob_time: string
            country_code: string
            clouds: number
            ts: number
            solar_rad: number
            state_code: string
            city_name: string
            wind_spd: number
            wind_cdir_full: string
            wind_cdir: string
            slp: number
            vis: number
            h_angle: number
            sunset: string
            dni: number
            dewpt: number
            snow: number
            uv: number
            precip: number
            wind_dir: number
            sunrise: string
            ghi: number
            dhi: number
            aqi: number
            lat: number
            weather: Weather
            datetime: string
            temp: number
            station: string
            elev_angle: number
            app_temp: number
        }
        
    } 
    
    export namespace Daily {
        export interface Result {
            data: Forecast[]
            city_name: string
            lon: number
            timezone: string
            lat: number
            country_code: string
            state_code: string
        }
        
        export interface Forecast {
            moonrise_ts: number
            wind_cdir: string
            rh: number
            pres: number
            high_temp: number
            sunset_ts: number
            ozone: number
            moon_phase: number
            wind_gust_spd: number
            snow_depth: number
            clouds: number
            ts: number
            sunrise_ts: number
            app_min_temp: number
            wind_spd: number
            pop: number
            wind_cdir_full: string
            slp: number
            moon_phase_lunation: number
            valid_date: string
            app_max_temp: number
            vis: number
            dewpt: number
            snow: number
            uv: number
            weather: Weather
            wind_dir: number
            max_dhi: any
            clouds_hi: number
            precip: number
            low_temp: number
            max_temp: number
            moonset_ts: number
            datetime: string
            temp: number
            min_temp: number
            clouds_mid: number
            clouds_low: number
        }
    }

    export interface Weather {
        icon: string
        code: number
        description: string
    }

    export function getForcastImgSrc(icon: string) {
        return `https://www.weatherbit.io/static/img/icons/${icon}.png`;
    }    

    export function  getAirQualityDescription(aqi: number) {
        let result = '';
        if (aqi >= 301) {
            result = 'Dangerous';
        } else if (aqi >= 201) {
            result = 'Very Unhealthy';
        } else if (aqi >= 151) {
            result = 'Unhealthy';
        } else if (aqi >= 101) {
            result = 'Poor';
        } else if (aqi >= 51) {
            result = 'Fair';
        } else {
            result = 'Excellent';
        }
        return result;
    }  

    export function getUVIndexDescription(uv: number) {
        let result = '';
        if (uv >= 11) {
            result = 'Extreme';
        } else if (uv >= 8) {
            result = 'Very High';
        } else if (uv >= 6) {
            result = 'High';
        } else if (uv >= 3) {
            result = 'Moderate';
        } else {
            result = 'Low';
        }
        return result;
    }      
}