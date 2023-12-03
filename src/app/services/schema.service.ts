import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WheelSchema } from '../interfaces/wheel-schema';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private apiUrl = 'http://localhost:3000/schemas';

  constructor(private httpClient: HttpClient) { }

  public async getSchema(schemaId: string): Promise<WheelSchema | undefined> {
    return lastValueFrom(this.httpClient.get<WheelSchema>(`${this.apiUrl}/${schemaId}`));
  }

  public async createSchema(schema: WheelSchema): Promise<void> {
    return lastValueFrom(this.httpClient.post<void>(this.apiUrl, schema));
  }

  public async updateSchema(schemaId: string, schema: WheelSchema): Promise<void> {
    return lastValueFrom(this.httpClient.put<void>(`${this.apiUrl}/${schemaId}`, schema));
  }
}
