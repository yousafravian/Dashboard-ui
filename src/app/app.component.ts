import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {CompanyDataComponent} from "./company-data/company-data.component";
import {DataService} from "./data.service";
import {AsyncPipe} from "@angular/common";
import {InfoCardComponent} from "./info-card/info-card.component";
import {LineChartComponent} from "./line-chart/line-chart.component";
import {TasksListComponent} from "./tasks-list/tasks-list.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CompanyDataComponent, AsyncPipe, InfoCardComponent, LineChartComponent, TasksListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
