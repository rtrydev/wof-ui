import { Routes } from '@angular/router';
import { WheelEditorComponent } from './components/wheel-editor/wheel-editor.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: 'wheel/:id', component: WheelEditorComponent, pathMatch: 'full'
    },
    {
        path: '', component: HomeComponent, pathMatch: 'full'
    }
];
