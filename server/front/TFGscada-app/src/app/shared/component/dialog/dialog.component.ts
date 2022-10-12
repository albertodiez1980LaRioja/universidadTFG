import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogColumn, IDialogConfig } from './dialog.interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  form!: FormGroup;
  columnsShow: IDialogColumn[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogConfig,
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    // not validate password if is a update
    console.log('dialog config', this.data);
    let parameters: any = {};
    for (let i = 0; i < this.data.columns.length; i++) {
      const numColumn = this.data.columns[i].prop;
      let value = this.data.columns[i].value;
      if (this.data.action == 'insert')
        value = '';
      if (this.data.columns[i].canView == undefined || this.data.columns[i].canView == true) {
        this.columnsShow.push(this.data.columns[i]);
        if (this.data.action != 'update' || this.data.columns[i].type != 'password')
          parameters[numColumn] = [value, Validators.required];
        else
          parameters[numColumn] = [value];
      }
      else
        parameters[numColumn] = [value];
    }
    this.form = this.fb.group(parameters);
  }

  save() {
    if (this.form != undefined) {
      if (this.form.status == 'VALID')
        this.dialogRef.close(this.form.value);
      else
        console.log('Formulario no válido');
    }
    else
      this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  // https://blog.angular-university.io/angular-material-dialog/

}
