import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SolarPanel } from '../../interfaces/solar-panel.interface';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  selector: 'app-panel-dialog',
  styleUrl: './panel-dialog.scss',
  templateUrl: './panel-dialog.html',
})
export class PanelDialog implements OnInit {
  dialogRef = inject(MatDialogRef<PanelDialog>);
  data = inject(MAT_DIALOG_DATA);

  isEditMode = !!this.data;

  formData: Partial<SolarPanel> = {
    location: '',
    capacity: null as any,
    todayProduction: null as any,
    status: 'Active'
  };

  ngOnInit() {
    if (this.isEditMode) {
      this.formData = { ...this.data };
    }
  }

  isValid(): boolean {
    return !!this.formData.location && 
            this.formData.location.length >= 3 && 
            this.formData.capacity !== null && 
            (this.formData.capacity ?? 0) > 0 &&
            !!this.formData.status;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.formData);
  }
}
