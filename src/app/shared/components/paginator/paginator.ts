import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10;
  @Input() totalItems: number = 100;
  @Input() itemsPerPage: number = 10;
  @Output() onPageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.onPageChange.emit(page);
    }
  }


}
