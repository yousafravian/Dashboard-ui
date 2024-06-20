import {JsonPipe, NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";
import {Component} from "@angular/core";

@Component({
  selector: 'app-bread-crumbs',
  standalone: true,
  imports: [NgForOf, JsonPipe, NgTemplateOutlet, NgComponentOutlet],
  templateUrl: './bread-crumbs.component.html',
  styleUrl: './bread-crumbs.component.scss'
})
export class BreadCrumbsComponent {
}
