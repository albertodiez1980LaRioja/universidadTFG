import app from './app';
import config from '../config/config';

function main() {
    app.listen(config.expressPort);
    console.log('servidor levantado en el ', config.expressPort);
};

main();