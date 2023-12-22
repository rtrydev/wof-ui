import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelSchema } from '../../../interfaces/wheel-schema';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wheel-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel-list.component.html',
  styleUrl: './wheel-list.component.scss'
})
export class WheelListComponent {
  @Input()
  public wheelSchemas: WheelSchema[] = [];

  constructor(private router: Router) {}

  public navigateToSchema(schemaId: string) {
    this.router.navigateByUrl(`wheel/${schemaId}`);
  }
}
