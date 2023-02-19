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
};

export const dialogConfig: IDialogConfig = {
    editable: true,
    columns: [
        { name: 'id', prop: 'id', type: 'text', canView: false },
        { name: 'Nombre de usuario', prop: 'user_name', type: 'text' },
        { name: 'Nombre', prop: 'name', type: 'text' },
        { name: 'Correo electrónico', prop: 'email', type: 'email' },
        { name: 'Telefono fijo', prop: 'telephone', type: 'text' },
        { name: 'Telefono móvil', prop: 'celular', type: 'text' },
        { name: 'DNI', prop: 'dni', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
        { name: 'Contraseña', prop: 'pass', type: 'password', canSearch: false },
        { name: 'Rol', prop: 'roleText', type: 'combo', arrayValues: [0, 1, 2], arrayShows: ['Administrador', 'Operario', 'Usuario'] },
    ],
    title: 'Datos del usuario',
    action: 'insert'
}