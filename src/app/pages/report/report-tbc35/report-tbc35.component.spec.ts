import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc35Component } from './report-tbc35.component';

describe('ReportTbc35Component', () => {
  let component: ReportTbc35Component;
  let fixture: ComponentFixture<ReportTbc35Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc35Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc35Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
