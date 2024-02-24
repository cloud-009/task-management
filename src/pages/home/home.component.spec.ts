import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: SharedService;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SharedService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing date formatter, if returning the correct date format
  it('should format the date correctly', () => {
    const inputDate: string = '2024-02-23';
    const expectedDate: string = 'February 23, 2024';
    expect(component.formatDate(inputDate)).toEqual(expectedDate);
    fixture.detectChanges();
    const inputDate2: string = '2024-12-10';
    const expectedDate2: string = 'December 10, 2024';
    expect(component.formatDate(inputDate2)).toEqual(expectedDate2);
  });

  // testing invalid date format
  it('should handle invalid date input', () => {
    const inputDate: string = 'invalid';
    expect(component.formatDate(inputDate)).toEqual('Invalid Date NaN, NaN');
  });

  // testing invalid date format
  it('should handle invalid date input', () => {
    const inputDate: string = '23/02/2024';
    expect(component.formatDate(inputDate)).toEqual('Invalid Date NaN, NaN');
  });

  // testing the toggle dropdown
  it('should toggle the dropdown', () => {
    const mockElement: HTMLDivElement = document.createElement('div');
    const mockEvent = { currentTarget: mockElement } as unknown as MouseEvent;
    spyOnProperty(mockElement, 'nextElementSibling', 'get').and.returnValue(mockElement);
    component.toggleDropdown(mockEvent);
    expect(mockElement.style.display).toEqual('block');
    fixture.detectChanges();
    component.toggleDropdown(mockEvent);
    expect(mockElement.style.display).toEqual('none');
  });

  it('should delete the task from home page', fakeAsync(() => {
    const mockId: number = 1;
    component.taskDetailsResponse = [
      {
        id: 1,
        title: 'mock title',
        dueDate: '2024-12-01',
        description: 'mock',
        assignedTo: 'mock',
        status: 'pending'
      },
      {
        id: 2,
        title: 'mock title',
        dueDate: '2024-12-01',
        description: 'mock',
        assignedTo: 'mock',
        status: 'pending'
      }
    ];
    // open the dropdown
    const mockElement: HTMLDivElement = document.createElement('div');
    const mockEvent = { currentTarget: mockElement } as unknown as MouseEvent;
    spyOnProperty(mockElement, 'nextElementSibling', 'get').and.returnValue(mockElement);
    component.toggleDropdown(mockEvent);
    fixture.detectChanges();
    expect(mockElement.style.display).toEqual('block');

    // trigger delete method
    component.deleteTask(mockId);
    flush();
    fixture.detectChanges();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle()?.textContent).toEqual('Are you sure?');
    Swal.clickConfirm();
  }));

  it('should handle error while deleting', () => {
    const serviceSpy = spyOn(service, 'deleteTaskDetails').and.returnValue(throwError(() => new Error('Error occured')));

    // open the dropdown
    const mockElement: HTMLDivElement = document.createElement('div');
    const mockEvent = { currentTarget: mockElement } as unknown as MouseEvent;
    spyOnProperty(mockElement, 'nextElementSibling', 'get').and.returnValue(mockElement);
    component.toggleDropdown(mockEvent);
    fixture.detectChanges();
    expect(mockElement.style.display).toEqual('block');

    // trigger delete method
    component.deleteTask(1);
    fixture.detectChanges();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle()?.textContent).toEqual('Are you sure?');
    Swal.clickConfirm();
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it('should truncate long text with tooltip', () => {
    const longText = 'This is a long text that exceeds the maximum length';
    const maxLength = 20;
    const result = component.truncateTitleWithTooltip(longText, maxLength);
    expect(result.showTooltip).toBeTrue();
    expect(result.truncatedText.length).toBe(maxLength + 3); // +3 for ellipsis(...)
  });

  it('should not truncate short text', () => {
    const shortText = 'Short text';
    const maxLength = 20;
    const result = component.truncateTitleWithTooltip(shortText, maxLength);
    expect(result.showTooltip).toBeFalse();
    expect(result.truncatedText).toBe(shortText);
  });

  it('should route to edit page with id', () => {
    const mockId: number = 1;
    const routerSpy = spyOn(router, 'navigate');
    component.editTaskDetails(mockId);
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/edittask/' + mockId]);
  });

  it('should destroy the subscription', () => {
    component['taskSubscription'] = new Subscription();
    const subsSpy = spyOn(component['taskSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subsSpy).toHaveBeenCalled();
  });
})
