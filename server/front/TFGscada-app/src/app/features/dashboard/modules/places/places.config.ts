import { IDialogConfig } from "src/app/shared/component/dialog/dialog.interfaces";
import { ITableConfig } from "src/app/shared/component/table/table.interfaces";

export const placesConfig: ITableConfig = {
    //filter: true,
    sort: true,
    paginator: true,
    columns: [
        { name: 'places.placesTable.latitude', prop: 'latitude', type: 'text' },
        { name: 'places.placesTable.longitude', prop: 'longitude', type: 'text' },
        { name: 'places.placesTable.direcction', prop: 'address', type: 'text', },
        { name: 'places.placesTable.identifier', prop: 'identifier', type: 'text' },
        { name: 'places.placesTable.actualizationTime', prop: 'actualizationTime', type: 'text' },
        { name: 'places.placesTable.users', prop: 'personsNames', type: 'list' },
    ],

    actions: [
        {
            name: 'Update',
            type: 'mat-icon-button',
            themeColor: 'primary',
            icon: 'create',
            tooltip: 'toolTips.modifi',
        },
        {
            name: 'Delete',
            type: 'mat-icon-button',
            themeColor: 'warn',
            icon: 'delete',
            tooltip: 'toolTips.delete',
        },
        {
            name: 'View',
            type: 'mat-icon-button',
            themeColor: 'accent',
            icon: 'remove_red_eye',
            tooltip: 'toolTips.view',
        },
    ],
};

export const dialogConfig: IDialogConfig = {
    editable: true,
    columns: [
        { name: 'id', prop: 'id', type: 'text', canView: false },
        { name: 'places.placesTable.latitude', prop: 'latitude', type: 'text', validators: 'validateLatitude' },
        { name: 'places.placesTable.longitude', prop: 'longitude', type: 'text', validators: 'validateLongitude' },
        { name: 'places.placesTable.direcction', prop: 'address', type: 'text', validators: 'validateDirecction' },
        { name: 'places.placesTable.identifier', prop: 'identifier', type: 'text', validators: 'nameUser' },
        { name: 'usersTable.pass', prop: 'pass', type: 'password', canSearch: false },
        { name: 'places.placesTable.actualizationTime', prop: 'actualizationTime', type: 'combo', arrayValues: [2, 5, 10, 20, 30, 60], arrayShows: ['2', '5', '10', '20', '30', '60'] },
        { name: 'places.placesTable.users', prop: 'persons', type: 'chip', chipsToSelect: ['2', '5', '10', '20', '30', '60'], chipsSelecteds: ['2', '5', '10', '20', '30', '60'] },
    ],
    title: 'places.dataSin',
    action: 'insert'
}