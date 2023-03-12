import { ITableConfig } from "src/app/shared/component/table/table.interfaces";


export const alarmsConfig: ITableConfig = {
    filter: false,
    sort: true,
    paginator: true,
    columns: [
        { name: 'alarms.dateInit', prop: 'date_time', type: 'date', datePipe: 'd/M/yy, H:mm:ss a' },
        { name: 'alarms.finished', prop: 'date_finish', type: 'date', datePipe: 'd/M/yy, H:mm:ss a' },
        { name: 'alarms.sensor', prop: 'sensorDescription', type: 'text' },
        { name: 'alarms.operator', prop: 'operatorDescription', type: 'text' },
        { name: 'alarms.place', prop: 'placeDescription', type: 'text' },
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

