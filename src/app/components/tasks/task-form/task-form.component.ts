import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    dueDate: new FormControl(new Date()),
  });

  @Input() isEditMode: boolean = false;

  ngOnInit() {}

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      // Emit event for create/edit
    }
  }

  onCancel() {
    // Emit cancel event
  }
}
