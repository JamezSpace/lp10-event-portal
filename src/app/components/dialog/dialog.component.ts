import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogActions, MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector: 'app-dialog',
    imports: [MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css'
})
export class DialogComponent {
    readonly dialogRef = inject(MatDialogRef<DialogComponent>);
    payers_name = signal('');
    payers_email = signal('');

    buttonClick(): void {
        this.dialogRef.close({ payers_name: this.payers_name(), payers_email: this.payers_email() });
    }
}
