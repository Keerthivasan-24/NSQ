import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() rows = 3;
  @Input() cols = 4;
  @Input() height = '20px';
  @Input() gap = '12px';

  rowArray: number[] = [];
  colArray: number[] = [];

  ngOnInit(): void {
    this.rowArray = Array(this.rows).fill(0);
    this.colArray = Array(this.cols).fill(0);
  }
}
