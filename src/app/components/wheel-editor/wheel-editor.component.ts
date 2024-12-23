import { AfterContentInit, Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelComponent } from "../shared/wheel/wheel.component";
import { SchemaService } from '../../services/schema.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, from, take, tap } from 'rxjs';
import { WheelSchema } from '../../interfaces/wheel-schema';
import { WheelOption } from '../../interfaces/wheel-option';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WheelElement } from '../../interfaces/wheel-element';
import { WheelElementWrite } from '../../interfaces/wheel-element-write';
import { WheelOptionsComponent } from "../shared/wheel-options/wheel-options.component";
import { WheelVariable } from '../../interfaces/wheel-variable';
import { WheelVariableListComponent } from "../shared/wheel-variable-list/wheel-variable-list.component";
import { WheelCollaborationOptionsComponent } from "../shared/wheel-collaboration-options/wheel-collaboration-options.component";
import { CollaborationService } from '../../services/collaboration.service';
import { LoginService } from '../../services/login.service';

@Component({
    selector: 'app-wheel-editor',
    standalone: true,
    templateUrl: './wheel-editor.component.html',
    styleUrl: './wheel-editor.component.scss',
    imports: [CommonModule, WheelComponent, ReactiveFormsModule, FormsModule, WheelOptionsComponent, WheelVariableListComponent, WheelCollaborationOptionsComponent]
})
export class WheelEditorComponent implements AfterContentInit {
  @Input()
  public set staticOptions(value: WheelElementWrite[]) {
    this._staticOptions = value;
    this.loadStaticWheel();
  }

  public demoMode: boolean = false;

  public currentWheelId?: string;
  public wheelName?: string;
  public options: WheelOption[] = [];
  public variables: WheelVariable[] = [];

  public userWheels: WheelSchema[] = [];
  public foreignWheels: WheelSchema[] = [];

  public wheelSize = 750;
  public calculatedWheelSize: number = this.wheelSize;

  public textSize = 20;
  public textOffset = 70;

  public textMarginTop = 0;
  public textMarginLeft = 0;

  public spinTime = 10000;
  public optionInputs: WheelElementWrite[] = [];

  public wheelProcessing = false;

  public showResult = false;
  public currentResult?: string;
  public variablesInCurrentResult?: WheelVariable[];

  public window = window;
  public canEdit = false;
  public isOwner = false;

  private _staticOptions?: WheelElementWrite[];

  constructor(
    private schemaService: SchemaService,
    private activatedRoute: ActivatedRoute,
    private collaborationService: CollaborationService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.schemaService.getSchemas().then(schemas => {
      this.userWheels = schemas.filter(s => s.id !== this.currentWheelId).map(schema => ({
        id: schema.id,
        name: schema.name,
        elements: schema.elements.map(e => ({
          id: e.id,
          text: e.text,
          locked: e.locked ?? false
        })),
        variables: schema.variables.map(v => ({
          variableName: v.variable_name,
          wheelId: v.wheel_id
        }))
      }));
    }).finally(() => {
      this.activatedRoute.params.pipe(
        take(1),
          tap((params: any) => {
            this.currentWheelId = params.id;
          }),
          tap(() => {
            this.loadWheel();
        })
      ).subscribe();
    });
  }

  ngAfterContentInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculatedWheelSize = Math.min(window.innerWidth, this.wheelSize);
  }

  public loadOptions(wheelSchema: WheelSchema): void {
    const optionCount = wheelSchema.elements.filter(e => !e.locked).length;
    this.wheelName = wheelSchema.name;

    this.options = wheelSchema.elements.filter(e => !e.locked).map(
      (element, idx) => ({
        id: element.id!,
        text: element.text,
        locked: element.locked,
        color: this.getColorForText(element.text),
        rotation: idx * (2 * Math.PI / optionCount),
        textRotation: `${-90 + (180 / optionCount)}deg`
      })
    );

    this.textMarginTop = -(this.textOffset - this.textSize) * Math.cos(Math.PI / optionCount);
    this.textMarginLeft = (this.textOffset) * Math.sin(Math.PI / optionCount);

    this.loadFormOptions(
      wheelSchema.elements.map(
        (element, idx) => ({
          id: element.id!,
          text: element.text,
          locked: element.locked,
          color: this.getColorForText(element.text),
          rotation: idx * (2 * Math.PI / optionCount),
          textRotation: `${-90 + (180 / optionCount)}deg`
        })
      )
    );
  }

  public addOption(): void {
    this.optionInputs.push({
      text: '',
      locked: false
    });
  }

  public async updateWheel(): Promise<void> {
    if (!this.currentWheelId || this.optionInputs.length === 0) {
      return;
    }

    this.wheelProcessing = true;

    const wheelData = {
      name: this.wheelName,
      elements: this.optionInputs
        .filter(input => input.text)
        .map(input => ({
          text: input.text,
          locked: input.locked
        })),
      variables: this.variables.map(
        v => ({
          variable_name: v.variableName,
          wheel_id: v.wheelId
        })
      )
    };

    await this.schemaService.updateSchema(
      this.currentWheelId,
      wheelData
    );

    this.wheelProcessing = false;

    this.loadWheel();
  }

  public removeOption(index: number): void {
    this.optionInputs.splice(index, 1);
    this.updateVariables();
  }

  public lockOption(index: number): void {
    if (!this.optionInputs[index]) {
      return;
    }

    this.optionInputs[index].locked = !this.optionInputs[index].locked;
  }

  public updateVariables(): void {
    const foundVariables = this.findVariables().map(v => v.toLowerCase());

    foundVariables.forEach(variableName => {
      if (!this.variables.some(variable => variable.variableName === variableName)) {
        this.variables.push({
          variableName
        });
      }
    });

    this.variables = this.variables.filter(v => foundVariables.includes(v.variableName));
  }

  public resultSelected(result: string): void {
    this.currentResult = result;

    this.variablesInCurrentResult = this.findVariablesInString(this.currentResult)
      .filter(v => !!this.variables.find(vr => vr.variableName === v)?.wheelId)
      .map(v => this.variables.find(vr => vr.variableName === v)!);

      this.showResult = true;
  }

  public getOptionsForWheelId(wheelId: string): WheelOption[] {
    const wheel = this.getAvailableWheels().find(wheel => wheel.id === wheelId);

    if (!wheel) {
      return [];
    }

    return this.loadOptionsFromElements(wheel.elements);
  }

  public getTextMarginTopForWheelId(wheelId: string): number {
    const wheel = this.userWheels.find(wheel => wheel.id === wheelId);

    if (!wheel) {
      return 0;
    }

    return -(this.textOffset - this.textSize) * Math.cos(Math.PI / wheel.elements.filter(e => !e.locked).length);
  }

  public getTextMarginLeftForWheelId(wheelId: string): number {
    const wheel = this.userWheels.find(wheel => wheel.id === wheelId);

    if (!wheel) {
      return 0;
    }

    return (this.textOffset) * Math.sin(Math.PI / wheel.elements.filter(e => !e.locked).length);
  }

  public resolveVariableInCurrentResult(variable: string, value: string): void {
    if (!this.currentResult) {
      return;
    }

    this.currentResult = this.currentResult.replaceAll(`{${variable}}`, value);
  }

  public getAvailableWheels(): WheelSchema[] {
    return [
      ...this.userWheels,
      ...this.foreignWheels
    ];
  }

  public getWheelNameForId(wheelId: string): string {
    const wheel = this.getAvailableWheels().find(wheel => wheel.id === wheelId);

    if (!wheel) {
      return '';
    }

    return wheel.name;
  }

  private loadWheel() {
    if (this.loadStaticWheel()) {
      return;
    }

    if (!this.currentWheelId) {
      return;
    }

    this.schemaService.getSchema(this.currentWheelId).then(
      schema => {
        if (!schema) {
          return;
        }

        const mappedSchema: WheelSchema = {
          id: schema.id,
          name: schema.name,
          elements: schema.elements.map(e => ({
            id: e.id,
            text: e.text,
            locked: e.locked ?? false
          })),
          variables: schema.variables.map(v => ({
            variableName: v.variable_name,
            wheelId: v.wheel_id
          }))
        };

        this.isOwner = this.userWheels.some(wheel => wheel.id === schema.id);

        if (!this.isOwner && !!this.loginService.currentUser) {
          this.collaborationService.getCollaborations()
            .pipe(
              tap(collaborations => {
                this.canEdit = collaborations.schema_ids.some(id => id === schema.id);
              })
            ).subscribe();
        } else {
          this.canEdit = this.isOwner;
        }

        this.loadOptions(mappedSchema);
        this.loadVariables(mappedSchema);
      }
    );
  }

  private loadStaticWheel(): boolean {
    if (!this._staticOptions) {
      return false;
    }

    this.demoMode = true;

    const mappedSchema: WheelSchema = {
      id: '',
      name: '',
      elements: this._staticOptions.map(e => ({
        id: '',
        text: e.text,
        locked: e.locked ?? false
      })),
      variables: []
    };

    this.isOwner = true;
    this.canEdit = true;

    this.loadOptions(mappedSchema);
    this.loadVariables(mappedSchema);

    return true;
  }

  private loadVariables(wheelSchema: WheelSchema): void {
    this.variables = wheelSchema.variables || [];

    forkJoin(
      this.variables
        .filter(variable => !!variable.wheelId && !this.userWheels
          .some(wheel => wheel.id === variable.wheelId)
        ).map(variable => from(this.schemaService.getSchema(variable.wheelId!)))
    ).subscribe(wheelSchemas => {
      this.foreignWheels = wheelSchemas
        .filter(schema => !!schema)
        .map(schema => ({
          id: schema!.id,
          name: schema!.name,
          elements: schema!.elements,
          variables: schema!.variables.map(
            variable => ({
              variableName: variable.variable_name
            })
          )
        }));
    });
  }

  private loadFormOptions(options: WheelOption[]) {
    this.optionInputs = options.map(option => ({
        text: option.text,
        locked: option.locked
      }));
  }

  private getColorForText(text: string) : string {
    const bytes = Array.from(text).map(char => char.charCodeAt(0));

    const normalizer = Math.max(...bytes) / 192 + 64;

    const avgByte = Math.floor((
      bytes.reduce(
        (a, b) => normalizer * (a % 255 + b % 255), 0
      ) / bytes.length
    ));

    let firstSegment = 0;
    let lastSegment = 0;

    if (avgByte < 64) {
      firstSegment = avgByte + 64;
      lastSegment = avgByte + 128;
    } else if (avgByte > 192) {
      firstSegment = avgByte - 128;
      lastSegment = avgByte - 64;
    } else {
      firstSegment = avgByte + 64;
      lastSegment = avgByte - 64;
    }

    return `#${firstSegment.toString(16)}${avgByte.toString(16)}${lastSegment.toString(16)}`
      .slice(0, 7).padEnd(7, '0');
  }

  private findVariables(): string[] {
    const variables: Set<string> = new Set();

    this.optionInputs.forEach(option => {
      const foundVariables = this.findVariablesInString(option.text);

      foundVariables.forEach(v => {
        variables.add(v);
      });
    });

    return Array.from(variables);
  }

  private findVariablesInString(str: string): string[] {
    return str.match(/{[a-zA-Z0-9]+}/gm)?.map(v => v.replace(/[{}]/g, '')) || [];
  }

  private loadOptionsFromElements(wheelElements: WheelElement[]): WheelOption[] {
    const optionCount = wheelElements.filter(e => !e.locked).length;

    return wheelElements.filter(e => !e.locked).map(
      (element, idx) => ({
        id: element.id!,
        text: element.text,
        locked: element.locked,
        color: this.getColorForText(element.text),
        rotation: idx * (2 * Math.PI / optionCount),
        textRotation: `${-90 + (180 / optionCount)}deg`
      })
    );
  }
}
