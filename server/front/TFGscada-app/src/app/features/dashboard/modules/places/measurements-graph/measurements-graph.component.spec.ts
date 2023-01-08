import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementsGraphComponent } from './measurements-graph.component';

describe('MeasurementsGraphComponent', () => {
  let component: MeasurementsGraphComponent;
  let fixture: ComponentFixture<MeasurementsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementsGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
