import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTaskById(userId:string): Observable<Task[]>{
    return this.http.get<Task[]>(`${this.apiUrl}/api/Task/${userId}`);
  }

  createTask(task: Task): Observable<Task>{
    return this.http.post<Task>(`${this.apiUrl}/api/Task/create`, task);
  }
}
