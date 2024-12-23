import { Component, ComponentRef, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { switchMap, tap } from 'rxjs';
import { WheelEditorComponent } from '../wheel-editor/wheel-editor.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, WheelOptionsComponent, ReactiveFormsModule, FormsModule, WheelListComponent, WheelEditorComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  public wheelName: string = '';
  public optionInputs: WheelElementWrite[] = [
    {text: 'Option 1', locked: false},
    {text: 'Option 2', locked: false},
    {text: 'Option 3', locked: false},
  ];

  public demoOptions: WheelElementWrite[] = [
    {text: 'Option 1', locked: false},
    {text: 'Option 2', locked: false},
    {text: 'Option 3', locked: false},
  ];

  public wheelProcessing = false;

  public isLoggedIn = false;
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
    this.isLoggedIn = !!this.loginService.currentUser;

    this.subs.push(
      this.loginService.loggedInSubject.subscribe(() => {
        this.loadSchemas();
        this.isLoggedIn = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
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

  public addOption(): void {
    this.optionInputs.push({
      text: '',
      locked: false
    });
    this.updateDemoWheel();
  }

  public removeOption(index: number): void {
    this.optionInputs.splice(index, 1);
    this.updateDemoWheel();
  }

  public updateDemoWheel() {
    this.demoOptions = [
      ...this.optionInputs
    ];
  }

  public lockOption(index: number) {
    this.optionInputs[index].locked = !this.optionInputs[index].locked;
    this.updateDemoWheel();
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
