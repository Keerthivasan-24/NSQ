import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/user.model';
import { AuditLog } from '../../../../core/models/audit-log.model';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  usersLoading = true;
  logsLoading = true;
  
  // Users Table
  userColumns: string[] = ['userId', 'name', 'role', 'status', 'lastLogin', 'actions'];
  userDataSource = new MatTableDataSource<User>([]);
  
  // Audit Logs Table
  logColumns: string[] = ['timestamp', 'userId', 'action', 'details'];
  logDataSource = new MatTableDataSource<AuditLog>([]);

  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;
  
  @ViewChild('logPaginator') logPaginator!: MatPaginator;
  @ViewChild('logSort') logSort!: MatSort;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAuditLogs();
  }

  ngAfterViewInit(): void {
    this.userDataSource.paginator = this.userPaginator;
    this.userDataSource.sort = this.userSort;
    
    this.logDataSource.paginator = this.logPaginator;
    this.logDataSource.sort = this.logSort;
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.apiService.showLoading('Fetching system users list...');
    this.userService.getUsers().subscribe({
      next: (res) => {
        if (res.success) {
          this.userDataSource.data = res.users;
        }
        this.usersLoading = false;
        this.apiService.hideLoading();
      },
      error: (err) => {
        this.usersLoading = false;
        this.apiService.hideLoading();
        this.showSnackBar('Failed to load users list.');
      }
    });
  }

  loadAuditLogs(): void {
    this.logsLoading = true;
    this.userService.getAuditLogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.logDataSource.data = res.logs;
        }
        this.logsLoading = false;
      },
      error: (err) => {
        this.logsLoading = false;
        this.showSnackBar('Failed to load audit logs.');
      }
    });
  }

  applyUserFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyLogFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.logDataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.showLoading('Registering new user...');
        this.userService.createUser(result).subscribe({
          next: (res) => {
            if (res.success) {
              this.showSnackBar(`User '${result.userId}' registered successfully!`);
              this.loadUsers();
              this.loadAuditLogs();
            }
          },
          error: (err) => {
            this.apiService.hideLoading();
            this.showSnackBar(err.error?.message || 'Failed to register user.');
          }
        });
      }
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.showLoading('Saving user details...');
        this.userService.updateUser(user.id, result).subscribe({
          next: (res) => {
            if (res.success) {
              this.showSnackBar(`User details for '${user.userId}' updated!`);
              this.loadUsers();
              this.loadAuditLogs();
            }
          },
          error: (err) => {
            this.apiService.hideLoading();
            this.showSnackBar(err.error?.message || 'Failed to update user.');
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (user.userId === 'admin') {
      this.showSnackBar('Cannot delete primary Admin account.');
      return;
    }

    if (confirm(`Are you sure you want to permanently delete user '${user.userId}' (${user.name})?`)) {
      this.apiService.showLoading(`Deleting user ${user.userId}...`);
      this.userService.deleteUser(user.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.showSnackBar(`User '${user.userId}' deleted successfully.`);
            this.loadUsers();
            this.loadAuditLogs();
          }
        },
        error: (err) => {
          this.apiService.hideLoading();
          this.showSnackBar(err.error?.message || 'Failed to delete user.');
        }
      });
    }
  }

  showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
