import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc37Component } from './report-tbc37.component';

describe('ReportTbc37Component', () => {
  let component: ReportTbc37Component;
  let fixture: ComponentFixture<ReportTbc37Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc37Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc37Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
