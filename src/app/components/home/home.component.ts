import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOptionsComponent } from "../shared/wheel-options/wheel-options.component";
import { WheelElementWrite } from '../../interfaces/wheel-element-write';
import { SchemaService } from '../../services/schema.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WheelListComponent } from "../shared/wheel-list/wheel-list.component";
import { WheelSchema } from '../../interfaces/wheel-schema';
import { LoginService } from '../../services/login.service';
import { CollaborationService } from '../../services/collaboration.service';
import { forkJoin, map, switchMap, tap, zip } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, WheelOptionsComponent, ReactiveFormsModule, FormsModule, WheelListComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  public wheelName: string = '';
  public optionInputs: WheelElementWrite[] = [
    {text: 'Option 1', locked: false},
    {text: 'Option 2', locked: false},
    {text: 'Option 3', locked: false},
  ];

  public wheelProcessing = false;

  public userSchemas: WheelSchema[] = [];
  public collaborationSchemas: WheelSchema[] = [];

  private subs: any[] = [];

  constructor(
    private schemaService: SchemaService,
    private loginService: LoginService,
    private router: Router,
    private collaborationService: CollaborationService
  ) {}

  ngOnInit(): void {
    this.loadSchemas();

    this.subs.push(
      this.loginService.loggedInSubject.subscribe(() => {
        this.loadSchemas();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public addOption(): void {
    this.optionInputs.push({
      text: '',
      locked: false
    });
  }

  public async createWheel(): Promise<void> {
    if (this.optionInputs.length === 0) {
      return;
    }

    this.wheelProcessing = true;

    const wheelData = {
      name: this.wheelName || 'My Wheel',
      elements: this.optionInputs
        .filter(input => input.text)
        .map(input => ({
          text: input.text,
          locked: input.locked
        }))
    };

    const result = await this.schemaService.createSchema(
      wheelData
    );

    setTimeout(() => {
      this.wheelProcessing = false;
    }, 100);

    if (result) {
      this.router.navigateByUrl(`wheel/${result.id}`);
    }
  }

  public removeOption(index: number): void {
    this.optionInputs.splice(index, 1);
  }

  private loadSchemas() {
    if (!this.loginService.currentUser) {
      return;
    }

    this.schemaService.getSchemas().then(schemas => {
      this.userSchemas = schemas.map(schema => ({
        id: schema.id,
        name: schema.name,
        elements: schema.elements.map(e => ({
          id: e.id,
          text: e.text,
          locked: e.locked
        })),
        variables: schema.variables.map(v => ({
          variableName: v.variable_name,
          wheelId: v.wheel_id
        }))
      }));
    });

    this.collaborationService.getCollaborations()
      .pipe(
        tap(collaborations => {
          this.collaborationSchemas = collaborations.schema_ids.map(schemaId => ({
            id: schemaId,
            name: '',
            elements: [],
            variables: []
          }));
        }),
        switchMap((collaborations: {schema_ids: string[]}) => {
          return collaborations.schema_ids.map(
            schemaId => this.schemaService.getSchema(schemaId)
              .then(schema => {
                if (!schema) {
                  return;
                }

                const idx = this.collaborationSchemas.findIndex(c => c.id === schema?.id);

                if (idx !== -1) {
                  this.collaborationSchemas[idx] = {
                    id: schema.id,
                    name: schema.name,
                    elements: schema.elements,
                    variables: schema.variables.map(variable => ({
                      variableName: variable.variable_name,
                      wheelId: variable.wheel_id
                    }))
                  };
                }
              })
          );
        })
      ).subscribe();
  }
}
