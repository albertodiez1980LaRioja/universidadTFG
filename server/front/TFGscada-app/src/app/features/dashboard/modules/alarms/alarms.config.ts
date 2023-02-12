import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const alarmsConfig: ITableConfig = {
    filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'Fecha de inicio', prop: 'date_time', type: 'date' },

    ],
    actions: [
        {
            name: 'Update',
            type: 'mat-icon-button',
            themeColor: 'primary',
            icon: 'create',
            tooltip: 'Modificar registro',
        },
    ],
};

