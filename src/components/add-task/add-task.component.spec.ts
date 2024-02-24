import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ITaskInterface } from '../../interface/task-interface';
import { SharedService } from '../../services/shared.service';
import { Subscription, of, throwError } from 'rxjs';
import { RouterTestingModule } from "@angular/router/testing";

/* 
skipping testing toaster message as it is already tested library
only testing if toaster is fired or not

skipping the private method to test (populateInputFields)
*/

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let mockFormData: ITaskInterface = {
    id: 1,
    title: 'mock title',
    dueDate: '2024-12-01',
    description: 'mock',
    assignedTo: 'mock',
    status: 'pending'
  };
  let service: SharedService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1' //activated route mock
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SharedService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test post form data when form is valid and no error
  it('should call postFormData', () => {
    const mockSpy: jasmine.Spy = spyOn(service, 'addTaskDetails').and.callFake(() => {
      return of(mockFormData);
    });
    const routerSpy: jasmine.Spy = spyOn(router, 'navigate');
    component.taskForm.setValue({
      title: 'mock title',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    component.postFormData();
    fixture.detectChanges();
    expect(mockSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  // testing subscription error
  it('should handle error while posting form data', () => {
    component.taskForm.setValue({
      title: 'mock title',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    expect(component.taskForm.valid).toBeTruthy();
    const mockSpy: jasmine.Spy = spyOn(service, 'addTaskDetails').and.returnValue(throwError(() => new Error('Error occured')));
    component.postFormData();
    fixture.detectChanges();
    expect(mockSpy).toHaveBeenCalled();
  });

  // testing form invalid
  it('should open toaster message if form is not valid', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'addTaskDetails').and.callFake(() => {
      return of(mockFormData);
    });
    const toastSpy: jasmine.Spy = spyOn(component['toast'], 'fire');
    component.taskForm.setValue({
      title: '',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    expect(component.taskForm.valid).not.toBeTruthy();
    component.postFormData();
    fixture.detectChanges();
    expect(toastSpy).toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  // testing getTask data by id method if id is there and no error
  it('should get the task data by ID', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'getTaskDetailByID').and.callFake(() => {
      return of(mockFormData);
    });
    // for checking if method called or not, without <any> can't spy on private methods
    const methodSpy: jasmine.Spy = spyOn<any>(component, 'populateInputFields');
    component.getTaskDetailsByID();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalledWith(1);
    expect(component['taskId']).toEqual(1);
    expect(component['isEditMode']).toBeTruthy();
    expect(methodSpy).toHaveBeenCalledWith(mockFormData);
  });

  // testing error callback for getTaskDetailsByID
  it('should handle error if any while calling getTaskDetailsByID', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'getTaskDetailByID').and.returnValue(throwError(() => new Error('Error occured')));
    const toastSpy: jasmine.Spy = spyOn(component['toast'], 'fire');
    component.getTaskDetailsByID();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalled();
  });

  // testing updateTaskDetails if form is valid and no error
  it('should update the task details', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'updateTaskDetails').and.callFake(() => {
      return of(mockFormData);
    });
    const routerSpy: jasmine.Spy = spyOn(router, 'navigate');
    const toasterSpy: jasmine.Spy = spyOn(component['toast'], 'fire');
    component.taskForm.setValue({
      title: 'mock title',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    expect(component.taskForm.valid).toBeTruthy();
    component.updateTaskDetails();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['home']);
    expect(serviceSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalled();
  });

  // testing error callback in updateTaskDetails method
  it('should check for the error while updating', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'updateTaskDetails').and.returnValue(throwError(() => new Error('Error ocurred')));
    const toasterSpy: jasmine.Spy = spyOn(component['toast'], 'fire');
    component.taskForm.setValue({
      title: 'mock title',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    expect(component.taskForm.valid).toBeTruthy();
    component.updateTaskDetails();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalled();
  });

  // testing form invalid while updating
  it('should check for invalid input fields', () => {
    const serviceSpy: jasmine.Spy = spyOn(service, 'updateTaskDetails').and.callFake(() => {
      return of(mockFormData);
    })
    const toasterSpy: jasmine.Spy = spyOn(component['toast'], 'fire');
    component.taskForm.setValue({
      title: '',
      dueDate: '2024-12-01',
      description: 'mock',
      assignedTo: 'mock',
      status: 'pending'
    });
    expect(component.taskForm.valid).toBeFalsy();
    component.updateTaskDetails();
    fixture.detectChanges();
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(toasterSpy).toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.handleCancel();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['home']);
  });

  it('should destroy the subscription', () => {
    component['postSubscription'] = new Subscription();
    const subsSpy = spyOn(component['postSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subsSpy).toHaveBeenCalled();
  });
});
