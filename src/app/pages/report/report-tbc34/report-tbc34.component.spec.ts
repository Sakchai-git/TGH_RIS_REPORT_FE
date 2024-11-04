import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc34Component } from './report-tbc34.component';

describe('ReportTbc34Component', () => {
  let component: ReportTbc34Component;
  let fixture: ComponentFixture<ReportTbc34Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc34Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc34Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
