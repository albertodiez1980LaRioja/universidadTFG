import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const actionsConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'Fecha', prop: 'date', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'Usuario', prop: 'userNick', type: 'text' },
        { name: 'Salida', prop: 'out', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
        { name: 'Lugar', prop: 'placeName', type: 'text' },
        { name: 'Enviado', prop: 'sended', type: 'text' },
        { name: 'Valor', prop: 'value', type: 'text' },
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

