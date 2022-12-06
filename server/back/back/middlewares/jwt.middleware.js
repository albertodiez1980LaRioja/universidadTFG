'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
import Person from '../src/api/persons/persons-model';
import Place from '../src/api/places/places-model';

module.exports = async function (req, res, next) {
    if (config.isApiSecured != 'false') {
        if (config.routesWhitelist.includes(req.originalUrl)) {

        }
        else {
            let token = req.body.token || req.query.token || req.headers["x-access-token"];
            if (!token) {
                return res.status(401).send('Invalid token');

            }
            if (['/api/actions/place/place', '/api/places/actualization'].includes(req.originalUrl)
                || (['/api/measurements'].includes(req.originalUrl) && req.method == 'POST')) {
                try {
                    //if (req.method == 'POST')
                    console.log(req.body);
                    const decoded = jwt.verify(token, config.secret);
                    if (decoded) {
                        const place = await Place.findAll({
                            where: {
                                identifier: decoded.place.identifier, pass: decoded.place.pass
                            }
                        });
                        if (!place || place === undefined) {
                            return res.status(401).send('Invalid token');
                        }
                    }
                    if (!decoded) {
                        return res.status(401).send('Invalid token');
                    }
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


