import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const measurementsConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'places.placesTable.identifier', prop: 'placeId', type: 'text' },
        { name: 'place_measurements.time', prop: 'date_time', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'place_measurements.vibracion', prop: 'vibration', type: 'text' },
        { name: 'place_measurements.obstaculos', prop: 'obstacle', type: 'text' },
        { name: 'place_measurements.luz', prop: 'light', type: 'text' },
        { name: 'place_measurements.fuego', prop: 'fire', type: 'text' },
        //{ name: 'binary_values', prop: 'binary_values', type: 'text' },
        { name: 'place_measurements.personas', prop: 'has_persons', type: 'text' },
        { name: 'place_measurements.sonido', prop: 'has_sound', type: 'text' },
        { name: 'place_measurements.aceite', prop: 'has_oil', type: 'text' },
        { name: 'place_measurements.gas', prop: 'has_gas', type: 'text' },
        { name: 'place_measurements.lluvia', prop: 'has_rain', type: 'text' },
        { name: 'place_measurements.temperatura', prop: 'temperature', type: 'text' },
        { name: 'place_measurements.humedad', prop: 'humidity', type: 'text' },
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
    title: 'usersTable.userData',
    action: 'insert'
}