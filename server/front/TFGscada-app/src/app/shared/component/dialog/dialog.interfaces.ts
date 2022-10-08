export interface IDialogConfig {
    columns: IDialogColumn[];
    title: string;
}

export interface IDialogColumn {
    prop: string; // name of column
    type:
    | 'text'
    | 'icon'
    | 'button'
    | 'checkbox'
    | 'date'
    | 'colorText'
    | 'actions'
    | 'list';
    label: string;
    showChip: boolean;
    canSearch: boolean;
    canChange: boolean;
    canView: boolean;
    arrayValues: string[];
}
