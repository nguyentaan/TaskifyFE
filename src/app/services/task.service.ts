import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { TaskStatusUpdate } from '../models/task-status-update.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTaskById(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/api/Task/${userId}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/api/Task/create`, task);
  }

  updateTask(taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/api/Task/update/${taskId}`,
      task
    );
  }

  updateTaskStatus(taskId: number, isCompleted: boolean): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body: TaskStatusUpdate = { isCompleted };
    return this.http.put<Task>(
      `${this.apiUrl}/api/Task/${taskId}/status`,
      body,
      { headers }
    );
  }

  deleteTask(taskId: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/api/Task/delete/${taskId}`);
  }
}
