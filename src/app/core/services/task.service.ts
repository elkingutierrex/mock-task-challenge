import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';

  getTasks(): Observable<Task[]> {
    return this.http.get<any[]>(`${this.API_URL}/todos`).pipe(
      map(todos => todos.map(todo => ({
        ...todo,
        // JSONPlaceholder doesn't have priority or date, so we simulate them
        priority: this.getRandomPriority(),
        dueDate: this.getRandomDate()
      }))),
      catchError(this.handleError)
    );
  }

  // Task create but unusable
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/todos/${task.id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  // Task create but unusable
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/todos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }


  private getRandomPriority(): 'low' | 'medium' | 'high' {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  private getRandomDate(): Date {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}
