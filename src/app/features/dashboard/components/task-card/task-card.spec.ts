import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../../../shared/models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskCardComponent', () => {
    let component: TaskCardComponent;
    let fixture: ComponentFixture<TaskCardComponent>;

    const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        completed: false,
        userId: 1,
        priority: 'high',
        dueDate: new Date()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskCardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskCardComponent);
        component = fixture.componentInstance;
        component.task = mockTask;
        fixture.detectChanges();
    });

    it('should render task title', () => {
        const titleEl = fixture.debugElement.query(By.css('.task-title')).nativeElement;
        expect(titleEl.textContent).toContain('Test Task');
    });

    it('should emit onToggle event when checkbox is clicked', () => {
        spyOn(component.onToggle, 'emit');

        const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
        checkbox.nativeElement.click(); // or triggerEventHandler('change', {})

        expect(component.onToggle.emit).toHaveBeenCalledWith(mockTask.id);
    });
});
