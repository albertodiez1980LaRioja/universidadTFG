import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMeasurementsComponent } from './place-measurements.component';

describe('PlaceMeasurementsComponent', () => {
  let component: PlaceMeasurementsComponent;
  let fixture: ComponentFixture<PlaceMeasurementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceMeasurementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
