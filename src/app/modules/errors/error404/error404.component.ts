import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
} from '../../../_metronic/kt/components';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss'],
})
export class Error404Component implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  routeToDashboard() {
    this.router.navigate(['dashboard']);
    setTimeout(() => {
      ToggleComponent.reinitialization();
      ScrollTopComponent.reinitialization();
      DrawerComponent.reinitialization();
      StickyComponent.bootstrap();
      MenuComponent.reinitialization();
      ScrollComponent.reinitialization();
    }, 200);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    document.body.style.backgroundImage = 'none';
  }
}
