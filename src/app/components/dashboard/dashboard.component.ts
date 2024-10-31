import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { error } from 'console';
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
  }

  getTaskById(userId: string): void {
    this.taskService.getTaskById(userId).subscribe(
      (response: Task[]) => {
        this.tasks = response;
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
    // Logic to create a new task (e.g., send to a service)
    this.taskService.createTask(taskToCreate).subscribe(
      (createdTask: Task) => {
        console.log('New Task Created:', createdTask);

        this.newTask = {
          title: '',
          description: '',
          dueDate: '',
          userId: this.userData.sub,
        };
        this.isAddTaskVisible = false;
        this.getTaskById(this.userData.sub);
      },
      (error: any) => {
        console.error('Error creating task:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
