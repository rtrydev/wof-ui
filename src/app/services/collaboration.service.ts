import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = 'https://api.wof.rtrydev.com/collaborations';

  constructor(private httpClient: HttpClient) { }

  public getCollaborations() {
    return this.httpClient.get<{schema_ids: string[]}>(`${this.apiUrl}/`);
  }

  public joinCollaboration(wheelId: string, token: string) {
    return lastValueFrom(this.httpClient.post(`${this.apiUrl}/${wheelId}/join/${token}`, {}));
  }

  public getCollaborationForSchema(wheelId: string) {
    return lastValueFrom(this.httpClient.get<{collaboration: {id: string, schema_id: string, token: string}}>(`${this.apiUrl}/${wheelId}`));
  }

  public createCollaboration(wheelId: string) {
    return lastValueFrom(this.httpClient.post<{id: string, collaboration_token: string}>(`${this.apiUrl}/`, {schema_id: wheelId}));
  }
}
