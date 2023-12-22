import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WheelEditorComponent } from "./components/wheel-editor/wheel-editor.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        RouterOutlet,
        WheelEditorComponent,
        HeaderComponent
    ]
})
export class AppComponent {
  title = 'wof-ui';
}
