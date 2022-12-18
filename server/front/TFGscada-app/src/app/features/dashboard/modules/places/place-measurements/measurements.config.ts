import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const measurementsConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'placeId', prop: 'placeId', type: 'text' },
        { name: 'date_time', prop: 'date_time', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'Vibración', prop: 'vibration', type: 'text' },
        { name: 'Obstaculos', prop: 'obstacle', type: 'text' },
        { name: 'Luz', prop: 'light', type: 'text' },
        { name: 'Fuego', prop: 'fire', type: 'text' },
        { name: 'binary_values', prop: 'binary_values', type: 'text' },
        { name: 'has_persons', prop: 'has_persons', type: 'text' },
        { name: 'has_sound', prop: 'has_sound', type: 'text' },
        { name: 'has_oil', prop: 'has_oil', type: 'text' },
        { name: 'has_gas', prop: 'has_gas', type: 'text' },
        { name: 'has_rain', prop: 'has_rain', type: 'text' },
        { name: 'temperature', prop: 'temperature', type: 'text' },
        { name: 'humidity', prop: 'humidity', type: 'text' },
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

export const dialogConfig: IDialogConfig = {
    editable: true,
    columns: [
        { name: 'id', prop: 'id', type: 'text', canView: false },
        { name: 'Latitud', prop: 'latitude', type: 'text' },
        { name: 'Longitud', prop: 'longitude', type: 'text' },
        { name: 'Dirección', prop: 'address', type: 'text' },
    ],
    title: 'Datos del usuario',
    action: 'insert'
}