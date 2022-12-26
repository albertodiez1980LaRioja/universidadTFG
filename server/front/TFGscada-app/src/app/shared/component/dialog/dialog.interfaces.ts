import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface IDialogConfig {
    columns: IDialogColumn[];
    title: string;
    action: 'insert' | 'update' | 'view' | 'search';
    editable: boolean;
}

export interface IDialogColumn {
    prop: string; // name of column
    type:
    | 'text'
    | 'email'
    | 'combo'
    | 'checkbox'
    | 'date'
    | 'chip'
    | 'password';
    name: string;
    showChip?: boolean;
    canSearch?: boolean;
    canChange?: boolean;
    canView?: boolean;
    arrayValues?: any[];
    arrayShows?: string[];
    value?: any;
    // to chips
    chipsSelecteds?: string[];
    chipsToSelect?: string[];
    auxCtrl?: FormControl;
    filteredElements?: Observable<string[]>;

}
