import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc32Component } from './report-tbc32.component';

describe('ReportTbc32Component', () => {
  let component: ReportTbc32Component;
  let fixture: ComponentFixture<ReportTbc32Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc32Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
