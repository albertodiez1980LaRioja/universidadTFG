import Place from './api/places/places-model';
import Measurement from './api/measurements/measurements-model';
const axios = require('axios').default;


let SimulatePlaces = class {
    constructor() {
        this.places = undefined;
    }

    async intervalFunc() {
        const host = 'http://localhost';
        const port = 3000;
        //if (this.places == undefined) {
        const aux = await Place.findAll();
        this.places = [];
        for (let i = 0; i < aux.length; i++)
            if (aux[i].id != 1)
                this.places.push(aux[i].dataValues);
        //}
        // insert good value
        let measurement = await Measurement.findAll({
            where: { placeId: 1 },
            limit: 1, order: [['date_time', 'DESC']]
        });
        if (measurement.length > 0) {
            measurement = measurement[0].dataValues;
            axios.post(host + ':' + port.toString() + '/api/places/authenticate', {
                identifier: 'aaaaa',
                pass: 'abc'
            }).then((responseToken) => {
                axios.defaults.headers.post['x-access-token'] = responseToken.data.token;
                for (let i = 0; i < this.places.length; i++) {
                    axios.post(host + ':' + port.toString() + '/api/measurements', {
                        date_time: new Date(), binary_values: measurement.binary_values,
                        has_persons: measurement.has_persons, has_sound: measurement.has_sound,
                        has_gas: measurement.has_gas, has_oil: measurement.has_oil,
                        has_rain: measurement.has_rain, temperature: measurement.temperature,
                        humidity: measurement.humidity, placeId: this.places[i].id
                    })
                        .then(function (response) {
                            if (response.data.message == 'Created succefully')
                                console.log('measurement inserted');
                            else
                                console.log('measurement not inserted');
                        })
                        .catch(function (error) {
                            console.log('Error en Axios: ', error);
                        });
                }
            }).catch((error) => { console.log(error); });
        }
    }

    createInterval() {
        setInterval(this.intervalFunc, 5000);
    }
}


module.exports = SimulatePlaces;