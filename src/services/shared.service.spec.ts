import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedService } from './shared.service';
import { ITaskInterface } from '../interface/task-interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('SharedService', () => {
  let service: SharedService;
  let httpControl: HttpTestingController;
  let mockArrayData: Array<ITaskInterface> = [
    {
      title: 'some title',
      description: 'some description',
      status: 'pending',
      dueDate: '2024-02-23',
      assignedTo: 'soome one',
      id: 1
    },
    {
      title: 'some title',
      description: 'some description',
      status: 'pending',
      dueDate: '2024-02-23',
      assignedTo: 'soome one',
      id: 2
    }
  ];

  let mockObjectData: ITaskInterface = {
    title: 'some title',
    description: 'some description',
    status: 'pending',
    dueDate: '2024-02-23',
    assignedTo: 'soome one',
    id: 1
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SharedService);
    httpControl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpControl.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get task details from the url', () => {
    service.getTaskDetails().subscribe({
      next: (res: Array<ITaskInterface>) => {
        expect(res).toEqual(mockArrayData);
      }
    })
    // also we can skip passing the actual url with {}
    const request = httpControl.expectOne(`${service['url']}/tasks`);
    expect(request.request.method).toEqual('GET');
    request.flush(mockArrayData);
  });

  it('should check for the get task call fail/error', () => {
    const errorMessage = 'Error adding task details';
    service.getTaskDetails().subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.statusText).toBe(errorMessage);
      }
    });
    const request = httpControl.expectOne(`${service['url']}/tasks`);
    expect(request.request.method).toEqual('GET');
    request.flush(null, { status: 500, statusText: errorMessage });
  });

  it('should add new task details', () => {
    service.addTaskDetails(mockObjectData).subscribe({
      next: (res: ITaskInterface) => {
        expect(res).toEqual(mockObjectData);
      }
    })
    const request = httpControl.expectOne(`${service['url']}/tasks`);
    expect(request.request.method).toEqual('POST');
    request.flush(mockObjectData);
  });

  it('should check for the post task call fail/error', () => {
    const errorMessage = 'Error adding task details';
    service.addTaskDetails(mockObjectData).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.statusText).toBe(errorMessage);
      }
    });
    const request = httpControl.expectOne(`${service['url']}/tasks`);
    expect(request.request.method).toEqual('POST');
    request.flush(null, { status: 500, statusText: errorMessage });
  });

  it('should call the delete method', () => {
    const taskId = 1;
    service.deleteTaskDetails(taskId).subscribe({
      // void is not allowing to mock {}
      next: (res: any) => {
        expect(res).toEqual({});
      }
    });
    const req = httpControl.expectOne(`${service['url']}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update task details', () => {
    const taskId = 1;
    service.updateTaskDetails(taskId, mockObjectData).subscribe((res: ITaskInterface) => {
      expect(res).toEqual(mockObjectData);
    });
    const req = httpControl.expectOne(`${service['url']}/tasks/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockObjectData);
    req.flush(mockObjectData);
  });

  it('should check for the update task call fail/error', () => {
    const errorMessage: string = 'Error adding task details';
    const taskId: number = 1;
    service.updateTaskDetails(taskId, mockObjectData).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.statusText).toBe(errorMessage);
      }
    });
    const request = httpControl.expectOne(`${service['url']}/tasks/${taskId}`);
    expect(request.request.method).toEqual('PUT');
    request.flush(null, { status: 500, statusText: errorMessage });
  });

  it('should retrieve task details by ID', () => {
    const taskId = 1;
    service.getTaskDetailByID(taskId).subscribe({
      next: (res: ITaskInterface) => {
        expect(res).toEqual(mockObjectData);
      }
    })
    const req = httpControl.expectOne(`${service['url']}/tasks/${taskId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockObjectData);
  });

  it('should check for the get task by id call fail/error', () => {
    const errorMessage: string = 'Error adding task details';
    const taskId: number = 1;
    service.getTaskDetailByID(taskId).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        expect(error.statusText).toBe(errorMessage);
      }
    });
    const request = httpControl.expectOne(`${service['url']}/tasks/${taskId}`);
    expect(request.request.method).toEqual('GET');
    request.flush(null, { status: 500, statusText: errorMessage });
  });
});
