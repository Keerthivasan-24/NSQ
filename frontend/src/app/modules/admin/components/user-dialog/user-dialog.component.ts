import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.user;
    
    this.userForm = this.fb.group({
      userId: [
        { value: this.data?.user?.userId || '', disabled: this.isEditMode },
        [Validators.required, Validators.minLength(3)]
      ],
      name: [this.data?.user?.name || '', [Validators.required]],
      role: [this.data?.user?.role || 'General User', [Validators.required]],
      status: [this.data?.user?.status || 'Active', [Validators.required]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    const rawVal = this.userForm.getRawValue();
    this.dialogRef.close(rawVal);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
