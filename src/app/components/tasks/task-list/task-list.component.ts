import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  @Input() userId!: string;
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.isLoading = false; // Set loading to false when component initializes
  }

  onEdit(task: Task): void {
    this.editTask.emit(task);
  }

  updateTaskStatus(taskId: number, isCompleted: boolean): void {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    const originalStatus = this.tasks[taskIndex].isCompleted;

    this.tasks[taskIndex].isCompleted = isCompleted;
    this.taskService.updateTaskStatus(taskId, isCompleted).subscribe({
      next: (response) => console.log('Task Updated:', response),
      error: (error) => {
        console.error(error);
        this.tasks[taskIndex].isCompleted = originalStatus; // Revert on error
      },
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: (response) => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.snackbar.showSuccess('Task deleted successfully');
      },
      error: (error) => {
        console.error(error);
        this.snackbar.showError('Task deletion failed');
      },
    });
  }
}
