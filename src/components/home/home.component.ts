import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ITaskInterface } from '../../interface/task-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  taskDetailsResponse: Array<ITaskInterface> = [];
  taskSubscription!: Subscription;
  dropdownElement!: HTMLElement;

  constructor(private service: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.taskDetails();
  }

  // alert message toaster
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

  private taskDetails(): void {
    this.taskSubscription = this.service.getTaskDetails().subscribe({
      next: (res: Array<ITaskInterface>) => {
        this.taskDetailsResponse = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  // date formatter from type yyyy-mm-dd to februrary 23, 2024
  public formatDate(inputDate: string): string {
    const dateParts: Array<string> = inputDate.split('-'); // Split by dash (-) instead of slash (/)
    const date: Date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])); // Year, month, day
    const monthName: string = date.toLocaleString('en-US', { month: 'long' });
    const dayYear: string = `${date.getDate()}, ${date.getFullYear()}`;
    const formattedDate: string = `${monthName} ${dayYear}`;

    return formattedDate;
  }

  // dropdown for edit & delete actions
  public toggleDropdown(event: MouseEvent) {
    this.dropdownElement = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    this.dropdownElement.style.display === 'block' ? this.dropdownElement.style.display = 'none' : this.dropdownElement.style.display = 'block';
  }

  public deleteTask(id: number): void {
    this.dropdownElement.style.display = 'none';
    Swal.fire({
      titleText: 'Are you sure?',
      text: 'Once you delete, it cannot be recovered!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.service.deleteTaskDetails(id).subscribe({
          next: () => {
            this.toast.fire({
              icon: 'success',
              text: 'Deleted successfully',
              showConfirmButton: false,
            })
            this.taskDetails();
          },
          error: (err: HttpErrorResponse) => {
            this.toast.fire({
              icon: 'error',
              text: 'Error while deleting'
            })
            console.log(err);
          }
        })
      }
    })
  }

  // sending id in the route
  public editTaskDetails(id: number) {
    this.router.navigate(['/edittask/' + id]);
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

}
