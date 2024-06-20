import { Component } from '@angular/core';
import {BreadCrumbsComponent} from "./bread-crumbs/bread-crumbs.component";
import {CrumbComponent} from "./bread-crumbs/crumb/crumb.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BreadCrumbsComponent,
    CrumbComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
