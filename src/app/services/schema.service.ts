import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WheelSchema } from '../interfaces/wheel-schema';
import { lastValueFrom } from 'rxjs';
import { WheelSchemaWrite } from '../interfaces/wheel-schema-write';
import { WheelSchemaRead } from '../interfaces/wheel-schema-read';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private apiUrl = 'https://api.wof.rtrydev.com/schemas';

  constructor(private httpClient: HttpClient) { }

  public async getSchemas(): Promise<WheelSchemaRead[]> {
    return lastValueFrom(this.httpClient.get<WheelSchemaRead[]>(`${this.apiUrl}/`));
  }

  public async getSchema(schemaId: string): Promise<WheelSchemaRead | undefined> {
    return lastValueFrom(this.httpClient.get<WheelSchemaRead>(`${this.apiUrl}/${schemaId}`));
  }

  public async createSchema(schema: WheelSchemaWrite): Promise<{id: string} | undefined> {
    return lastValueFrom(this.httpClient.post<{id: string}>(`${this.apiUrl}/`, schema));
  }

  public async updateSchema(schemaId: string, schema: WheelSchemaWrite): Promise<void> {
    return lastValueFrom(this.httpClient.put<void>(`${this.apiUrl}/${schemaId}`, schema));
  }
}
