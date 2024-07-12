import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationService } from '../../../services/collaboration.service';

@Component({
  selector: 'app-wheel-collaboration-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel-collaboration-options.component.html',
  styleUrl: './wheel-collaboration-options.component.scss'
})
export class WheelCollaborationOptionsComponent implements OnInit {
  @Input()
  public wheelId: string = "";

  public loadingCollaboration = true;
  public shareInProgress = false;
  public collaboration: {id: string, schema_id: string, token: string} | undefined;

  public copied: boolean = false;

  constructor(private collaborationService: CollaborationService) { }

  ngOnInit(): void {
    this.loadCollaborationOptions();
  }

  public getGeneratedInvitationLink() {
    return `https://wof.rtrydev.com/wheel/${this.wheelId}/invitation/${this.collaboration?.token}`;
  }

  public async share() {
    this.shareInProgress = true;
    const collaboration = await this.collaborationService.createCollaboration(this.wheelId);
    this.shareInProgress = false;

    this.collaboration = {
      id: collaboration.id,
      schema_id: this.wheelId,
      token: collaboration.collaboration_token
    };
  }

  public copyLinkToClipboard() {
    navigator.clipboard.writeText(this.getGeneratedInvitationLink());

    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 5000);
  }

  private async loadCollaborationOptions() {
    try {
      const response = await this.collaborationService.getCollaborationForSchema(this.wheelId);

      this.collaboration = response.collaboration;
    } catch (err) { }

    this.loadingCollaboration = false;
  }

}
