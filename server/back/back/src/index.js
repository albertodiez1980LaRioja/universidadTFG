import app, { initializeDatabase } from './app';
import config from '../config/config';

async function main() {
    try {
        await initializeDatabase();
        app.listen(config.expressPort, () => {
            console.log('servidor levantado en el ', config.expressPort);
        });
    } catch (err) {
        console.error('No se pudo inicializar la base de datos:', err);
        process.exitCode = 1;
    }
}

main();