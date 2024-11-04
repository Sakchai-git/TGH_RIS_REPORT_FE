import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc36Component } from './report-tbc36.component';

describe('ReportTbc36Component', () => {
  let component: ReportTbc36Component;
  let fixture: ComponentFixture<ReportTbc36Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc36Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc36Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
