


let AlarmGestor = class {
    constructor() {
        this.places = undefined;
    }

    async intervalFunc() {
        console.log('Se escanean las alarmas');
    }

    createInterval() {
        setInterval(this.intervalFunc, 5000);

    }
}

module.exports = AlarmGestor;