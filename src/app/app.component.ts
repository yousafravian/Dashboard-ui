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
  #dataService = inject(DataService)
  companyData$ = this.#dataService.getCompanyData();

  lineChartLabels = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
    "2036",
    "2037",
    "2038",
    "2039",
    "2040",
    "2041",
    "2042",
    "2043",
    "2044",
    "2045",
    "2046",
    "2047",
    "2048",
    "2049",
    "2050"
  ];
  lineChartdata = [
    {
      legend: "Average Predicted Temperature",
      label: "Predicted Temperature",
      data: this.#dataService.avgYearlyPredictedTemperature,
      color: "black"
    },
    {
      legend: "Maximum predicted temperature",
      label: "Maximum Temperature",
      data: this.#dataService.maxYearlyPredictedTemperature,
      color: "orange"
    },
    {
      legend: "Minimum predicted temperature",
      label: "Minimum Temperature",
      data: this.#dataService.minYearlyPredictedTemperature,
      color: "green"
    }
  ];
}
