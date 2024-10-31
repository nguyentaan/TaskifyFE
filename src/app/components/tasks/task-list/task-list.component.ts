import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  @Input() userId!: string;
  @Input() tasks: Task[] = [];
  isLoading = true;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.isLoading = false; // Set loading to false when component initializes
  }
}
