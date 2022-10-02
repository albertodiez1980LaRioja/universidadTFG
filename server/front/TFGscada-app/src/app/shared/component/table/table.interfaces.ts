export interface ITableColumn {
    name: string;
    prop: any | IColumnButton[];
    type:
    | 'text'
    | 'icon'
    | 'button'
    | 'checkbox'
    | 'date'
    | 'colorText'
    | 'actions'
    | 'list';
    datePipe?: string;
    class?: string;
    width?: string;
    disabled?: boolean;
}

interface IAction {
    type:
    | 'mat-raised-button'
    | 'mat-stroked-button'
    | 'mat-flat-button'
    | 'mat-icon-button'
    | 'mat-fab'
    | 'mat-mini-fab'
    | 'mat-button';
    name: string;
    backgroundColor?: string;
    themeColor?: 'primary' | 'accent' | 'warn';
    color?: string;
    icon?: string;
    tooltip?: string;
}

export interface ITableConfig {
    columns: ITableColumn[];
    paginator?: boolean;
    sort?: boolean;
    filter?: boolean;
    actions?: IAction[];
    maxHeight?: string;
}

export interface IColumnButton {
    disabled?: boolean;
    width?: string;
    color?: string;
    backgroundColor?: string;
    text?: string;
    action?: string;
}