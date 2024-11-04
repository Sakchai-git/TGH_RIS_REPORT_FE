import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc31Component } from './report-tbc31.component';

describe('ReportTbc31Component', () => {
  let component: ReportTbc31Component;
  let fixture: ComponentFixture<ReportTbc31Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc31Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc31Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
