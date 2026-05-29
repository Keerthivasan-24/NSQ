import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-shared-spinner',
  templateUrl: './shared-spinner.component.html',
  styleUrls: ['./shared-spinner.component.css']
})
export class SharedSpinnerComponent {
  constructor(public apiService: ApiService) {}
}
