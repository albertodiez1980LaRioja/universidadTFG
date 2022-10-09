import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogConfig } from './dialog.interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  form!: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogConfig,
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('dialog config', this.data);
    let parameters: any = {};
    for (let i = 0; i < this.data.columns.length; i++) {
      const numColumn = this.data.columns[i].prop;
      //if (this.data.columns[i].arrayShows == undefined)
      parameters[numColumn] = [this.data.columns[i].value, Validators.required];
      /*if (this.data.columns[i].value != undefined && this.data.columns[i].arrayShows != undefined) {
        const index = this.data.columns[i].arrayShows || [];
        console.log(index, index[Number(this.data.columns[i].value)], this.data.columns[i].value);
        parameters[numColumn] = [index[this.data.columns[i].value], Validators.required];
      }*/
    }
    this.form = this.fb.group(parameters);
  }

  save() {
    if (this.form != undefined) {
      if (this.form.status == 'VALID')
        this.dialogRef.close(this.form.value);
    }
    else
      this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  // https://blog.angular-university.io/angular-material-dialog/

}
