import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const usersConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'usersTable.Username', prop: 'user_name', type: 'text' },
        { name: 'usersTable.name', prop: 'name', type: 'text' },
        { name: 'usersTable.correoElectronico', prop: 'email', type: 'text' },
        { name: 'usersTable.phone', prop: 'telephone', type: 'text' },
        { name: 'usersTable.celular', prop: 'celular', type: 'text' },
        { name: 'DNI', prop: 'dni', type: 'text' },
        { name: 'usersTable.direccion', prop: 'address', type: 'text' },
        { name: 'usersTable.rol', prop: 'roleText', type: 'text' },
    ],

    actions: [
        {
            name: 'Update',
            type: 'mat-icon-button',
            themeColor: 'primary',
            icon: 'create',
            tooltip: 'usersTable.modificarRegistro',
        },
        {
            name: 'Delete',
            type: 'mat-icon-button',
            themeColor: 'warn',
            icon: 'delete',
            tooltip: 'usersTable.delete',
        },
        {
            name: 'View',
            type: 'mat-icon-button',
            themeColor: 'accent',
            icon: 'remove_red_eye',
            tooltip: 'usersTable.view',
        },


    ],
};

export const dialogConfig: IDialogConfig = {
    editable: true,
    columns: [
        { name: 'id', prop: 'id', type: 'text', canView: false },
        { name: 'usersTable.Username', prop: 'user_name', type: 'text' },
        { name: 'usersTable.name', prop: 'name', type: 'text' },
        { name: 'usersTable.correoElectronico', prop: 'email', type: 'email' },
        { name: 'usersTable.phone', prop: 'telephone', type: 'text' },
        { name: 'usersTable.celular', prop: 'celular', type: 'text' },
        { name: 'DNI', prop: 'dni', type: 'text' },
        { name: 'usersTable.direccion', prop: 'address', type: 'text' },
        { name: 'usersTable.pass', prop: 'pass', type: 'password', canSearch: false },
        { name: 'usersTable.rol', prop: 'roleText', type: 'combo', arrayValues: [0, 1, 2], arrayShows: ['Administrador', 'Operario', 'Usuario'] },
    ],
    title: 'Datos del usuario',
    action: 'insert'
}