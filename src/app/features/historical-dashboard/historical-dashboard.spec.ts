import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDashboard } from './historical-dashboard';

describe('HistoricalDashboard', () => {
  let component: HistoricalDashboard;
  let fixture: ComponentFixture<HistoricalDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
