import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  imports: [],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css',
})
export class DeleteDialogComponent {
    private dialogRef = inject(MatDialogRef<DeleteDialogComponent>)

    emitChoice(choice: boolean) {
        this.dialogRef.close({choice})
    }
}
