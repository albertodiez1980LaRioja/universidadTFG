import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const usersConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'Nombre de usuario', prop: 'user_name', type: 'text' },
        { name: 'Nombre', prop: 'name', type: 'text' },
        { name: 'Correo electrónico', prop: 'email', type: 'text' },
        { name: 'Telefono fijo', prop: 'telephone', type: 'text' },
        { name: 'Telefono móvil', prop: 'celular', type: 'text' },
        { name: 'DNI', prop: 'dni', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
        { name: 'Rol', prop: 'roles', type: 'text' },
    ],

    actions: [
        {
            name: 'View',
            type: 'mat-icon-button',
            themeColor: 'accent',
            icon: 'remove_red_eye',
            tooltip: 'View',
        },

    ],
};
