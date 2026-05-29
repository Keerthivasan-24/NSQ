import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RecordResponse } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private apiService: ApiService) {}

  getRecords(): Observable<RecordResponse> {
    return this.apiService.get<RecordResponse>('records');
  }
}
