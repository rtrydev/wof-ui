import { Routes } from '@angular/router';
import { WheelCreatorComponent } from './components/wheel-creator/wheel-creator.component';
import { NewWheelComponent } from './components/new-wheel/new-wheel.component';

export const routes: Routes = [
    {
        path: 'wheel/:id', component: WheelCreatorComponent, pathMatch: 'full'
    },
    {
        path: '', component: NewWheelComponent, pathMatch: 'full'
    }
];
