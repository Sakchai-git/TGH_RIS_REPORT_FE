import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc311Component } from './report-tbc311.component';

describe('ReportTbc311Component', () => {
  let component: ReportTbc311Component;
  let fixture: ComponentFixture<ReportTbc311Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc311Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc311Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
