import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTbc11Component } from './report-tbc11.component';

describe('ReportTbc11Component', () => {
  let component: ReportTbc11Component;
  let fixture: ComponentFixture<ReportTbc11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTbc11Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTbc11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
