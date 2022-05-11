import { Sequelize } from "sequelize";


// la cadena de conexion
export const sequelize =  new Sequelize(
    //'node1',
    'uno',
    'postgres',
    'password',{
        host: 'localhost',
        dialect: 'postgres',
        pool:{
            max:5,
            min:0,
            require:30000,
            idle:10000
        },
        define: {
            timestamps: true,
            freezeTableName: true // para que no ponga a plural el nombre de las tablas
          },
        logging:false
    }
);