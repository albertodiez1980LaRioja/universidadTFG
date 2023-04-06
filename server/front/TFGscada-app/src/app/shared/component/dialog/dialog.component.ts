import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogColumn, IDialogConfig } from './dialog.interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomvalidationService } from './validators.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  form!: FormGroup;
  columnsShow: IDialogColumn[] = [];
  editable = true;
  fruitAux: string[] = ['hola'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogConfig,
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private customValidator: CustomvalidationService) {

    for (let i = 0; i < data.columns.length; i++)
      if (data.columns[i].type == 'chip')
        if (data.columns[i].chipsToSelect != undefined)
          this.fruitAux = data.columns[i].chipsToSelect as string[];
    this.filteredChips = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit, this.fruitAux.slice()) : this.fruitAux.slice())),
    );
  }

  ngOnInit(): void {
    // not validate password if is a updates
    let parameters: any = {};
    this.editable = this.data.editable;
    for (let i = 0; i < this.data.columns.length; i++) {
      const numColumn = this.data.columns[i].prop;
      let value = this.data.columns[i].value;
      if (this.data.action == 'insert' || this.data.columns[i].type == 'password')
        value = '';
      if (this.data.columns[i].canView == undefined || this.data.columns[i].canView == true) {
        if (this.data.action.toLowerCase() == 'insert' || this.data.action.toLowerCase() == 'update') {
          this.columnsShow.push(this.data.columns[i]);
          if (this.data.action.toLowerCase() == 'update' && this.data.columns[i].type == 'password')
            parameters[numColumn] = ['', this.customValidator.patternValidatorPassword()];
          else if (this.data.columns[i].type == 'chip')
            parameters[numColumn] = '';
          else {
            if (this.data.columns[i].validators == undefined)
              parameters[numColumn] = [value, Validators.required];
            else
              this.customValidator.assingValidator(parameters, numColumn, value, this.data.columns[i].validators);
          }
        }
        else {
          if (this.data.columns[i].canSearch === undefined || this.data.columns[i].canSearch == true) {
            this.columnsShow.push(this.data.columns[i]);
            parameters[numColumn] = [value];
          }
        }
      }
      else { // is search
        parameters[numColumn] = [value];
      }
    }
    this.form = this.fb.group(parameters);
  }

  save() {
    if (this.form != undefined) {
      if (this.form.status == 'VALID')
        this.dialogRef.close(this.form.value);
      else if (this.editable && this.data.action != 'search') {
        console.log('Formulario no válido');
      }
      else if (this.data.action == 'search')
        this.dialogRef.close(this.form.value);
      else
        this.dialogRef.close();
    }
    else
      this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  remove(value: string, column: IDialogColumn) {
    if (column.chipsSelecteds != undefined) {
      const index = column.chipsSelecteds.indexOf(value);
      if (index >= 0) {
        column.chipsSelecteds.splice(index, 1);
      }
    }
  }

  add($event: any, column: any) {
    // to put new elements
  }

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;

  selected($event: MatAutocompleteSelectedEvent, column: IDialogColumn) {
    if (column.chipsSelecteds)
      if (!column.chipsSelecteds.includes($event.option.viewValue))
        column.chipsSelecteds.push($event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string, allValues: string[]): string[] {
    const filterValue = value.toLowerCase();
    return allValues.filter(element => element.toLowerCase().includes(filterValue));
  }

  fruitCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredChips!: Observable<string[]>;

  // https://blog.angular-university.io/angular-material-dialog/

} 
