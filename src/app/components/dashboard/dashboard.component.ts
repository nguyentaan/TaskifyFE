import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userData: any;
  isAddTaskVisible = false;
  task: Task | undefined;
  newTask = { title: '', description: '', dueDate: '', userId: '' };
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  formMode: 'create' | 'update' = 'create';

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserDataFromToken();
    this.newTask.userId = this.userData.sub;
    this.getTaskById(this.userData.sub);
    // console.log(this.userData);
    // console.log(this.userData.sub);
  }

  toggleAddTask(): void {
    this.isAddTaskVisible = !this.isAddTaskVisible;
    if (this.isAddTaskVisible) {
      this.formMode = 'create';
      this.resetTaskForm();
    }
  }

  getTaskById(userId: string): void {
    this.taskService.getTaskById(userId).subscribe(
      (response: Task[]) => {
        this.tasks = response;
        this.filteredTasks = this.tasks;
        console.log('Task:', this.tasks);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  createTask(): void {
    const taskToCreate: Task = {
      ...this.newTask,
      dueDate: new Date(this.newTask.dueDate), // Convert to Date type
    };

    if (this.formMode === 'create') {
      this.taskService.createTask(taskToCreate).subscribe(
        (createdTask: Task) => {
          console.log('New Task Created:', createdTask);
          this.resetTaskForm();
          this.isAddTaskVisible = false;
          this.getTaskById(this.userData.sub);
        },
        (error: any) => {
          console.error('Error creating task:', error);
        }
      );
    } else if (this.formMode === 'update' && this.task) {
      if (this.task && this.task.id !== undefined) {
        this.updateTask(this.task.id, taskToCreate); // Assume 'id' is a property of Task
      } else {
        console.error('Task ID is undefined');
      }
    }
  }

  updateTask(taskId: number, task: Task): void {
    this.taskService.updateTask(taskId, task).subscribe(
      (updatedTask: Task) => {
        console.log('Task Updated:', updatedTask);
        this.getTaskById(this.userData.sub);
        this.resetTaskForm();
        this.isAddTaskVisible = false;
      },
      (error: any) => {
        console.error('Error updating task:', error);
      }
    );
  }

  onFilterChange(status: string) {
    switch (status) {
      case 'completed':
        this.filteredTasks = this.tasks.filter((task) => task.isCompleted);
        break;
      case 'incomplete':
        this.filteredTasks = this.tasks.filter((task) => !task.isCompleted);
        break;
      default:
        this.filteredTasks = this.tasks;
        break;
    }
  }

  resetTaskForm(): void {
    this.newTask = {
      title: '',
      description: '',
      dueDate: '',
      userId: this.userData.sub,
    };
    this.task = undefined;
    this.formMode = 'create';
  }

  editTask(task: Task): void {
    this.task = task;
    this.newTask = {
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0] // Force YYYY-MM-DD format
        : '', // Handle cases where dueDate might be undefined or invalid
      userId: task.userId || '',
    };
    this.formMode = 'update';
    this.isAddTaskVisible = true;
  }

  logout(): void {
    this.authService.logout();
  }
}
