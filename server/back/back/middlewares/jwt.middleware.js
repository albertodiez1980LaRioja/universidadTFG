'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
import Person from '../src/api/persons/persons-model';

module.exports = async function (req, res, next) {

    console.log('Se hace la llamada: ', req.originalUrl);
    if (config.isApiSecured != 'false') {
        console.log('no es apiSecured');
        if (config.routesWhitelist.includes(req.originalUrl)) {

        }
        else {
            let token = req.body.token || req.query.token || req.headers["x-access-token"];
            if (!token) {
                try {
                    token = req.headers["x-access-token-place"];
                    const decoded = jwt.verify(token, config.secret);
                    console.log('Decoded del place', decoded);
                    if (!token)
                        return res.status(403).send('A token is required for authentication');
                }
                catch {
                    return res.status(401).send('Invalid token');
                }
            }
            else {
                try {
                    const decoded = jwt.verify(token, config.secret);
                    const user = await Person.findAll({
                        where: {
                            user_name: decoded.usuario.user_name, pass: decoded.usuario.pass
                        }
                    });
                    if (!user || user === undefined) {
                        return res.status(401).send('Invalid token');
                    }
                    req.user = decoded;
                } catch (err) {
                    return res.status(401).send('Invalid token');
                }
            }
        }
    }
    next();
}


