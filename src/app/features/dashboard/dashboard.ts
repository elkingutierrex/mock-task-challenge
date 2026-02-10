import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { TaskCard } from './components/task-card/task-card';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, tap } from 'rxjs/operators';
import { Paginator } from '../../shared/components/paginator/paginator';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TaskCard, Paginator, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks$ = new BehaviorSubject<Task[]>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  // Filters
  filterStatus = new FormControl<'all' | 'completed' | 'pending'>('all');
  searchControl = new FormControl('');
  sortBy = new FormControl<'title' | 'date'>('date');

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  filteredTasks$: Observable<Task[]>;

  constructor() {
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.filterStatus.valueChanges.pipe(startWith('all')),
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.sortBy.valueChanges.pipe(startWith('date'))
    ]).pipe(
      map(([tasks, status, search, sort]) => {
        let filtered = tasks;

        // Filter by status
        if (status === 'completed') {
          filtered = filtered.filter(t => t.completed);
        } else if (status === 'pending') {
          filtered = filtered.filter(t => !t.completed);
        }

        // Filter by search
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = filtered.filter(t => t.title.toLowerCase().includes(lowerSearch));
        }

        // Sort
        filtered = filtered.sort((a, b) => {
          if (sort === 'title') {
            return a.title.localeCompare(b.title);
          } else {

            // Sort by date (simulated)
            return (b.dueDate?.getTime() || 0) - (a.dueDate?.getTime() || 0);
          }
        });

        this.totalItems = filtered.length;

        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return filtered.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading$.next(true);
    this.error$.next('');

    this.taskService.getTasks().pipe(
      tap(() => this.loading$.next(false)),
      catchError(err => {
        this.loading$.next(false);
        this.error$.next('Failed to load tasks. Please try again.');
        return of([]);
      })
    ).subscribe(tasks => {
      this.tasks$.next(tasks);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    this.tasks$.next(this.tasks$.value);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onToggleTask(id: number): void {
    const tasks = this.tasks$.value;
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      const updatedTask = { ...tasks[taskIndex], completed: !tasks[taskIndex].completed };

      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      this.tasks$.next(newTasks);

      this.taskService.updateTask(updatedTask).subscribe({
        error: () => {
          // Revert on error
          this.tasks$.next(tasks);
          // Show toast?
        }
      });
    }
  }

  onDeleteTask(id: number): void {
    const isConfirm = confirm('Are you sure, you want to delete it');
    if (isConfirm === false) {
      return;
    }
    const tasks = this.tasks$.value;

    this.tasks$.next(tasks.filter(t => t.id !== id));

    this.taskService.deleteTask(id).subscribe({
      error: () => {
        // Revert on error
        this.tasks$.next(tasks);
      }
    });
  }

  onEditTask(task: Task): void {
    console.log('Edit task', task);
    alert('MOCK - Edit functionality not implemented yet');
  }



  trackByTask(index: number, task: Task): number {
    return task.id;
  }
}
