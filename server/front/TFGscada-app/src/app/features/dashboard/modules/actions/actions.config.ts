import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const actionsConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'actions.fecha', prop: 'date', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'actions.usuario', prop: 'userNick', type: 'text' },
        { name: 'actions.salida', prop: 'out', type: 'text', translate: true },
        { name: 'actions.direccion', prop: 'address', type: 'text' },
        { name: 'actions.lugar', prop: 'placeName', type: 'text' },
        { name: 'actions.enviado', prop: 'sended', type: 'checkbox' },
        { name: 'actions.valor', prop: 'value', type: 'checkbox' },
    ],
    /*
    actions: [
            {
                name: 'Update',
                type: 'mat-icon-button',
                themeColor: 'primary',
                icon: 'create',
                tooltip: 'Modificar registro',
            },
            {
                name: 'Delete',
                type: 'mat-icon-button',
                themeColor: 'warn',
                icon: 'delete',
                tooltip: 'Borrar fila',
            },
            {
                name: 'View',
                type: 'mat-icon-button',
                themeColor: 'accent',
                icon: 'remove_red_eye',
                tooltip: 'View',
            },
    

    ],
    */
};

