import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc312Component } from './report-tbc312.component';

describe('ReportTbc312Component', () => {
  let component: ReportTbc312Component;
  let fixture: ComponentFixture<ReportTbc312Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc312Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc312Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
