import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc33Component } from './report-tbc33.component';

describe('ReportTbc33Component', () => {
  let component: ReportTbc33Component;
  let fixture: ComponentFixture<ReportTbc33Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc33Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc33Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
