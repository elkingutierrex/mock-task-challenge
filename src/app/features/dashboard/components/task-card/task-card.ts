import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCard {
  @Input({ required: true }) task!: Task;
  @Output() onToggle = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<Task>();
}
