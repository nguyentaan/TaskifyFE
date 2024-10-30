import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userData: any;
  isAddTaskVisible = false;
  newTask = { title: '', description: '', dueDate: '' };

  toggleAddTask(): void {
    this.isAddTaskVisible = !this.isAddTaskVisible;
  }

  createTask(): void {
    // Logic to create a new task (e.g., send to a service)
    console.log('New Task Created:', this.newTask);
    // Reset the form after submission
    this.newTask = { title: '', description: '', dueDate: '' };
    this.isAddTaskVisible = false; // Hide the form after creating the task
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userData = this.authService.getUserDataFromToken();
    console.log(this.userData);
  }
  logout(): void {
    this.authService.logout();
  }
}
