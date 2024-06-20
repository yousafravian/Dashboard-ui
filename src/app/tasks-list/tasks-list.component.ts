import {Component, inject} from '@angular/core';
import {InfoCardComponent} from "../info-card/info-card.component";
import {DataService} from "../data.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    InfoCardComponent,
    AsyncPipe
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {

  #dataService = inject(DataService);

  tasksList$ = this.#dataService.getTasksList();
}
