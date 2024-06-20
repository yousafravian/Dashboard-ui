import {Component, DestroyRef, inject} from '@angular/core';
import {BreadCrumbsComponent} from "./bread-crumbs/bread-crumbs.component";
import {CrumbComponent} from "./bread-crumbs/crumb/crumb.component";
import {NavigationEnd, Router} from "@angular/router";
import {JsonPipe, UpperCasePipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BreadCrumbsComponent,
    CrumbComponent,
    UpperCasePipe,
    JsonPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  router = inject(Router);
  destroyRef$ = inject(DestroyRef);
  crumbs: string[] = [];

  constructor() {
    this.subToRouterEvents();
  }

  onRoute(i: number): void {
    const route = this.crumbs.slice(0, i + 1).join('/');
    this.router.navigate([route]);
  }

  private subToRouterEvents(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.crumbs = this.router.url.split('/').filter(crumb => crumb !== '');
        }
      });
  }
}
