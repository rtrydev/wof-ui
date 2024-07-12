import { Routes } from '@angular/router';
import { WheelEditorComponent } from './components/wheel-editor/wheel-editor.component';
import { HomeComponent } from './components/home/home.component';
import { WheelCollaborationComponent } from './components/wheel-collaboration/wheel-collaboration.component';

export const routes: Routes = [
    {
        path: 'wheel/:id/invitation/:invitationToken', component: WheelCollaborationComponent, pathMatch: 'full'
    },
    {
        path: 'wheel/:id', component: WheelEditorComponent, pathMatch: 'full'
    },
    {
        path: '', component: HomeComponent, pathMatch: 'full'
    }
];
