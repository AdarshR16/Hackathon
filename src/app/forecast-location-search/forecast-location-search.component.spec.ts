import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastLocationSearchComponent } from './forecast-location-search.component';

describe('ForecastLocationSearchComponent', () => {
  let component: ForecastLocationSearchComponent;
  let fixture: ComponentFixture<ForecastLocationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastLocationSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastLocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
