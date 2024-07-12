import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemaService } from '../../services/schema.service';
import { ActivatedRoute, Router } from '@angular/router';
import { from, switchMap, take, tap } from 'rxjs';
import { CollaborationService } from '../../services/collaboration.service';

@Component({
  selector: 'app-wheel-collaboration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel-collaboration.component.html',
  styleUrl: './wheel-collaboration.component.scss'
})
export class WheelCollaborationComponent implements OnInit {
  public wheelName: string = '';
  public acceptInProgress: boolean = false;

  private wheelId: string = '';
  private invitationToken: string = '';

  constructor(
    private schemaService: SchemaService,
    private collaborationService: CollaborationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      take(1),
      tap((params: any) => {
        this.wheelId = params.id;
        this.invitationToken = params.invitationToken;
      }),
      switchMap(() => {
        return from(this.loadInvitation());
      })
    ).subscribe();
  }

  public async acceptInvitation() {
    try {
      this.acceptInProgress = true;
      await this.collaborationService.joinCollaboration(this.wheelId, this.invitationToken);
    } catch (err) {
      this.router.navigateByUrl('/');
      return;
    }

    this.acceptInProgress = false;

    this.router.navigateByUrl(`/wheel/${this.wheelId}`);
  }

  private async loadInvitation() {
    const wheelData = await this.schemaService.getSchema(this.wheelId);

    if (!wheelData) {
      this.router.navigateByUrl('/');
      return;
    }

    this.wheelName = wheelData.name;
  }
}
