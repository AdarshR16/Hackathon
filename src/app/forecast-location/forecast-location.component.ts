// ============================================================================
//    
// ============================================================================
import { Component, Input, OnInit } from '@angular/core';
import { PositionStack } from '../models/positionstack';

@Component({
  selector: 'app-forecast-location',
  templateUrl: './forecast-location.component.html',
  styleUrls: ['./forecast-location.component.css']
})
export class ForecastLocationComponent implements OnInit {

    @Input()
    location!: PositionStack.Location;
    
    constructor() { }

    ngOnInit(): void {
    }

    getCity() {
        return this.location.locality ? this.location.locality: this.location.county;
    }
}