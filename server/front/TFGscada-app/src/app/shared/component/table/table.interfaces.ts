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
    sticky?: boolean;
    class?: string;
    editable?: boolean;
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
    sticky?: boolean;
    icon?: string;
    tooltip?: string;
}

export interface ITableConfig {
    columns: ITableColumn[];
    paginator?: boolean;
    sort?: boolean;
    filter?: boolean;
    stickyHeader?: boolean;
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