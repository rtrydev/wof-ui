import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WheelCreatorComponent } from "./components/wheel-creator/wheel-creator.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        RouterOutlet,
        WheelCreatorComponent,
        HeaderComponent
    ]
})
export class AppComponent {
  title = 'wof-ui';
}
