import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc14Component } from './report-tbc14.component';

describe('ReportTbc14Component', () => {
  let component: ReportTbc14Component;
  let fixture: ComponentFixture<ReportTbc14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc14Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
