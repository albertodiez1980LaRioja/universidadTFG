import { ITableConfig } from "src/app/shared/component/table/table.interfaces";


export const alarmsConfig: ITableConfig = {
    filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'Fecha de inicio', prop: 'date_time', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'Finalizado', prop: 'date_finish', type: 'date', datePipe: 'M/d/yy, H:mm:ss a' },
        { name: 'Sensor', prop: 'sensorDescription', type: 'text' },
        { name: 'Operador encargado', prop: 'operatorDescription', type: 'text' },
        { name: 'Lugar', prop: 'placeDescription', type: 'text' },
    ],
    actions: [
        {
            name: 'Acusar',
            type: 'mat-icon-button',
            themeColor: 'primary',
            icon: 'thumb_up',
            tooltip: 'Acusar alarma',
        },
    ],
};

