import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = 'https://api.wof.rtrydev.com/collaborations';

  constructor(private httpClient: HttpClient) { }

  public getCollaborations() {
    return this.httpClient.get<{schema_ids: string[]}>(`${this.apiUrl}/`);
  }
}
