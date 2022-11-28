'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = async function (req, res, next) {

    console.log('Se hace la llamada: ', req.originalUrl);
    if (config.isApiSecured != 'false') {
        if (config.routesWhitelist.includes(req.originalUrl)) {

        }
        else {
            const token = req.body.token || req.query.token || req.headers["x-access-token"];
            if (!token)
                return res.status(403).send('A token is required for authentication');
            try {
                // habría que comprobar si esta en la base de datos
                const decoded = jwt.verify(token, config.secret);
                req.user = decoded;
                console.log(decoded);
            } catch (err) {
                return res.status(401).send('Invalid token');
            }
        }
    }
    next();
}


