import RangeAlarmModel from '../range-alarm/range-alarm-model';
import Alarm from './alarms-model';
import Sensor from '../sensors/sensors-model';
import { sequelize } from "../../database/database";
const { QueryTypes } = require('sequelize');


let AlarmGestor = class {
    constructor() {
        this.places = undefined;
    }

    sensorsById(measurement) {
        let ret = [];
        ret.push({ id: 1, value: measurement.has_persons });
        ret.push({ id: 2, value: 1 - (measurement.binary_values & 1) });
        ret.push({ id: 3, value: measurement.has_sound });
        ret.push({ id: 4, value: 1 - ((measurement.binary_values & 2) / 2) });
        ret.push({ id: 5, value: measurement.has_gas });
        ret.push({ id: 6, value: measurement.has_rain });
        ret.push({ id: 7, value: measurement.has_oil });
        ret.push({ id: 8, value: measurement.temperature });
        ret.push({ id: 9, value: measurement.humidity });
        ret.push({ id: 10, value: 1 - ((measurement.binary_values & 4) / 4) });
        ret.push({ id: 11, value: 1 - ((measurement.binary_values & 8) / 8) });
        return ret;
    }

    async loadData() {
        let ranges = [];
        let rangesAux = await RangeAlarmModel.findAll();
        rangesAux.forEach(range => ranges.push(range.dataValues))
        let activeAlarmsAux = await Alarm.findAll({ where: { date_finish: null } });
        let activeAlarms = [];
        activeAlarmsAux.forEach((element) => activeAlarms.push(element));
        // ahora toca leer las ultimas mediciones de cada lugar. Esto puede hacer que haya valores transitorios
        // que no generan alarmas. Dejaremos esto como sin importancia o como valores espúreos
        // hay que leer todos los places y sacar el last measurements de cada uno
        const lastMeasurements = await sequelize.query('select * from public.measurements ' +
            'where ("placeId",date_time) in ( ' +
            'select "placeId",max(date_time) from public.measurements m group by m."placeId" );'
            , { type: QueryTypes.SELECT });
        const sensorsAux = await Sensor.findAll();
        let sensors = [];
        sensorsAux.forEach((sensor) => sensors.push(sensor.dataValues));
        return { ranges, activeAlarms, lastMeasurements, sensors };
    }

    async intervalFunc() {
        console.log('Se escanean las alarmas');
        let { ranges, activeAlarms, lastMeasurements, sensors } = await this.loadData();
        lastMeasurements.forEach((measurement) => {
            const values = this.sensorsById(measurement);
            values.forEach(value => {
                const rangesFilted = ranges.filter((range) => range.idSensor == value.id);
                // tenemos el sensor de la medición y su rango de alarmas, ahora lo comparamos
                rangesFilted.forEach((range) => {
                    let activeAlarm = activeAlarms.find((element) => element.sensorId == value.id && element.placeId == measurement.placeId);
                    if (value.value >= range.range_low && value.value <= range.range_high) {
                        // buscar la posible alarma que este ya creada
                        if (activeAlarm == undefined) {  // create the alarm
                            let date = new Date(measurement.date_time);
                            date.setHours(date.getHours() + new Date().getTimezoneOffset() / 60);
                            Alarm.create({
                                date_time: date, sensorId: range.idSensor,
                                operatorId: null, date_finish: null, placeId: measurement.placeId
                            }).then()
                                .catch((err) => console.log('Error on create alarm: ', err));
                        }
                    }
                    else if (activeAlarm != undefined) {
                        let date = new Date(measurement.date_time);
                        date.setHours(date.getHours() + new Date().getTimezoneOffset() / 60);
                        activeAlarm.set({ date_finish: date });
                        activeAlarm.save().then().catch((err) => console.log('Error on save alarm', err));
                    }
                });
            });
        });
    }

    createInterval() {
        setInterval(this.intervalFunc.bind(this), 5000);
    }
}

module.exports = AlarmGestor;