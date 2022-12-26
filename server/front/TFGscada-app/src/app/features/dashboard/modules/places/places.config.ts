import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const placesConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'Latitud', prop: 'latitude', type: 'text' },
        { name: 'Longitud', prop: 'longitude', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
        { name: 'Identificador', prop: 'identifier', type: 'text' },
        { name: 'Tiempo de actualización', prop: 'actualizationTime', type: 'text' },
        { name: 'Usuarios', prop: 'personsNames', type: 'list' },
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
        { name: 'Latitud', prop: 'latitude', type: 'text' },
        { name: 'Longitud', prop: 'longitude', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
        { name: 'Identificador', prop: 'identifier', type: 'text' },
        { name: 'Contraseña', prop: 'pass', type: 'password', canSearch: false },
        { name: 'Tiempo de actualización', prop: 'actualizationTime', type: 'combo', arrayValues: [2, 5, 10, 20, 30, 60], arrayShows: ['2', '5', '10', '20', '30', '60'] },
        { name: 'Personas', prop: 'persons', type: 'chip', chipsToSelect: ['2', '5', '10', '20', '30', '60'], chipsSelecteds: ['2', '5', '10', '20', '30', '60'] },
    ],
    title: 'Datos del usuario',
    action: 'insert'
}