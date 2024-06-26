import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITaskInterface } from '../../interface/task-interface';
import Swal from 'sweetalert2';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnDestroy {

  public taskForm!: FormGroup;
  private postSubscription!: Subscription;
  private taskId!: number;
  public isEditMode: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private service: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: SpinnerVisibilityService
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
    this.getTaskDetailsByID();
  }

  // toaster message
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    background: '#fff',
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  private createFormGroup(): void {
    this.taskForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      dueDate: new FormControl('', [Validators.required]),
      assignedTo: new FormControl('', [Validators.required]),
      status: new FormControl('pending', [Validators.required]) //at first task will be on pending state
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.taskForm.controls;
  }

  public postFormData(): void {
    if (this.taskForm.valid) {
      this.spinner.show()
      this.postSubscription = this.service.addTaskDetails(this.taskForm.value).subscribe({
        next: () => {
          this.taskForm.reset();
          this.spinner.hide();
          this.toast.fire({
            icon: 'success',
            text: 'Task created successfully',
            showConfirmButton: false
          })
          this.router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
          this.toast.fire({
            icon: 'error',
            text: 'Something went wrong!',
            showConfirmButton: false
          })
        }
      })
    } else {
      this.toast.fire({
        icon: 'error',
        text: 'Please fill all the empty fields',
        showConfirmButton: false
      })
    }
  }

  public getTaskDetailsByID(): void {
    this.taskId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') ?? '', 10);//default to '' if id is null
    if (this.taskId !== undefined && !Number.isNaN(this.taskId)) {
      this.spinner.show();
      this.isEditMode = true;
      this.service.getTaskDetailByID(this.taskId).subscribe({
        next: (res: ITaskInterface) => {
          this.populateInputFields(res);
          this.spinner.hide();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
          this.toast.fire({
            icon: 'error',
            text: 'Something went wrong!',
            showConfirmButton: false
          })
        }
      });
    }
  }

  private populateInputFields(task: ITaskInterface): void {
    this.spinner.show();
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      status: task.status
    });
    this.spinner.hide();
  }

  public updateTaskDetails(): void {
    if (this.taskForm.valid) {
      this.spinner.show();
      this.service.updateTaskDetails(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.spinner.hide();
          this.router.navigate(['home']);
          this.toast.fire({
            icon: 'success',
            text: 'Task updated successfully',
            showConfirmButton: false
          })
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
          this.toast.fire({
            icon: 'error',
            text: 'Something went wrong!',
            showConfirmButton: false
          })
        }
      })
    } else {
      this.toast.fire({
        icon: 'error',
        text: 'Please fill all the empty fields',
        showConfirmButton: false
      })
    }
  }

  public handleCancel(): void {
    this.router.navigate(['home']);
  }


  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
