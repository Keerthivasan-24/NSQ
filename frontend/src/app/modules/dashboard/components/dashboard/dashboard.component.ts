import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../../core/services/auth.service';
import { RecordService } from '../../../../core/services/record.service';
import { User } from '../../../../core/models/user.model';
import { Record } from '../../../../core/models/record.model';
import { ApiService } from '../../../../core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  currentUser: User | null = null;
  isLoading = true;
  
  // Analytics
  stats = {
    total: 0,
    active: 0,
    pending: 0,
    completed: 0
  };

  // Table
  displayedColumns: string[] = ['id', 'verificationType', 'status', 'submittedDate', 'accessLevel', 'processingTime'];
  dataSource = new MatTableDataSource<Record>([]);
  
  // Filter variables
  filterStatus = '';
  filterType = '';
  searchQuery = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    public apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    // Add user column for admin
    if (this.currentUser?.role === 'Admin') {
      this.displayedColumns.splice(1, 0, 'userId');
    }
    
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  loadRecords(): void {
    this.isLoading = true;
    this.apiService.showLoading('Fetching verification records...');
    
    this.recordService.getRecords().subscribe({
      next: (res) => {
        if (res.success) {
          this.dataSource.data = res.records;
          this.calculateStats(res.records);
        }
        this.isLoading = false;
        this.apiService.hideLoading();
      },
      error: (err) => {
        this.isLoading = false;
        this.apiService.hideLoading();
        this.snackBar.open('Failed to load records. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  calculateStats(records: Record[]): void {
    this.stats.total = records.length;
    this.stats.completed = records.filter(r => r.status.toLowerCase() === 'completed').length;
    this.stats.pending = records.filter(r => r.status.toLowerCase() === 'pending').length;
    this.stats.active = records.filter(r => r.status.toLowerCase() === 'in progress').length;
  }

  applyFilter(): void {
    const filterValues = {
      status: this.filterStatus.toLowerCase(),
      type: this.filterType.toLowerCase(),
      search: this.searchQuery.toLowerCase().trim()
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterType = '';
    this.searchQuery = '';
    this.dataSource.filter = '';
  }

  createFilterPredicate(): (data: Record, filter: string) => boolean {
    return (data: Record, filter: string): boolean => {
      try {
        const searchTerms = JSON.parse(filter);
        
        const matchesStatus = !searchTerms.status || data.status.toLowerCase() === searchTerms.status;
        const matchesType = !searchTerms.type || data.verificationType.toLowerCase().includes(searchTerms.type);
        
        const searchStr = `${data.id} ${data.userId} ${data.verificationType} ${data.accessLevel} ${data.status}`.toLowerCase();
        const matchesSearch = !searchTerms.search || searchStr.includes(searchTerms.search);
        
        return matchesStatus && matchesType && matchesSearch;
      } catch (e) {
        return true;
      }
    };
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'in progress': return 'status-progress';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }
}
