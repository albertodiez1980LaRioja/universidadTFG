export interface IDialogConfig {
    columns: IDialogColumn[];
    title: string;
    action: 'insert' | 'update';
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
}
