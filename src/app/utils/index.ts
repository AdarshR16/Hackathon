// ============================================================================


import { RuntimeError } from "../models/errors";
import { ForecastLocationSearch } from "../models/forecastlocationsearch";

// ============================================================================
export namespace Utils {
    /**
    * FUNCTION: getCurrentPosition
    * USE: Gets the current position of the device
    * @param options: The PositionOptions
    * @return: A promise that will contain the GeolocationPosition of the device on completion
    */
    export async function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, options);
            } else {
                reject(new Error('Geolocation is not supported by this environment'));
            }
        });         
    }

    // Get the distance between two points in km
    export function getDistance(lat1: number, lon1: number,lat2: number,lon2: number) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
      
    function deg2rad(deg: number) {
        return deg * (Math.PI/180)
    }  

    export function convertTimezone(date: Date | string, timezone: string) {
        return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {timeZone: timezone}));   
    } 
    
    export function treatAsUTC(date: Date) {
        let result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    } 

    export function getWeekdayName(date: Date, locale: string = 'default') {
        return date.toLocaleDateString(locale, { weekday: 'long' });        
    } 

    export function getMonthName(date: Date, locale: string = 'default') {
        return date.toLocaleDateString(locale, { month: 'long' });        
    }     
    
    export function getDateString(date: Date, locale: string = 'default') {
        return date.toLocaleDateString(locale);
    }

    export function getTimeString(date: Date, locale: string = 'default') {
        return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true });
    }     
    
    export function getDateTimeString(date: Date) {
        return `${getDateString(date)}, ${getTimeString(date)}`;
    }

    export function displayError(error: any) {
        console.log(error);
        if (error instanceof GeolocationPositionError) {
            switch (error.code) {
                case GeolocationPositionError.PERMISSION_DENIED:
                    alert(`Location access is denied. Please allow access and try again!`);
                    break;
                case GeolocationPositionError.POSITION_UNAVAILABLE:
                    alert(`Location position is unavailable. Please allow access and try again!`);              
                    break;
                default:
                    alert(`Location could not be detected. Please try again!`);
                    break;
            }
        } else if (error instanceof RuntimeError.ForecastLocationError) {
            switch (error.code) {
                case ForecastLocationSearch.Type.SearchQuery:
                    alert(`Unable to display forecast. Location could not be determined from the entered search term. Please enter another search term and try again!`);               
                    break;
                case ForecastLocationSearch.Type.IP: 
                case ForecastLocationSearch.Type.GPS:
                    alert(`Unable to display forecast. Location could not be detected from your current position. Please try again!`);
                    break;
                default:
                    alert(`Unable to display forecast. Location could not be detected. Please try again!`);
                    break;
            }
        } else if (error instanceof RuntimeError.ForecastError) {
            alert(`There currently is no weather forecast information available for the selected location. Please try a different location!`);
        } else {
            alert(`Unable to display forecast. Please try again!`);
        }
    }

    export function isLocalNetwork(hostname = window.location.hostname) {
        return (
            (['localhost', '127.0.0.1', '', '::1'].includes(hostname))
            || (hostname.startsWith('192.168.'))
            || (hostname.startsWith('10.0.'))
            || (hostname.endsWith('.local'))
          )        
    }
    export function isSecureConnection() {
        return window.location.protocol === 'https:';
    }
}