import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITaskInterface } from '../interface/task-interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private readonly url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getTaskDetails(): Observable<Array<ITaskInterface>> {
    return this.http.get<Array<ITaskInterface>>(`${this.url}/tasks`);
  }

  public addTaskDetails(details: ITaskInterface): Observable<ITaskInterface> {
    return this.http.post<ITaskInterface>(`${this.url}/tasks`, details);
  }

  public deleteTaskDetails(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/tasks/${id}`);
  }

  public updateTaskDetails(id: number, details: ITaskInterface): Observable<ITaskInterface> {
    return this.http.put<ITaskInterface>(`${this.url}/tasks/${id}`, details);
  }

  public getTaskDetailByID(id: number): Observable<ITaskInterface> {
    return this.http.get<ITaskInterface>(`${this.url}/tasks/${id}`);
  }
}
