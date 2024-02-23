import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AddTaskComponent } from '../components/add-task/add-task.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'addtask',
        component: AddTaskComponent
    },
    {
        path: 'edittask/:id',
        component: AddTaskComponent
    }
];
